import React, { useState, useMemo, useEffect, useReducer, useRef } from 'react';
import { Search, Star, GitFork, ExternalLink, ChevronLeft, ChevronRight, LoaderCircle, ServerCrash, Github, Sparkles } from 'lucide-react';

// --- TYPE DEFINITIONS ---
/**
 * @typedef {object} GitHubUser
 * @property {string} login
 * @property {string} avatar_url
 * @property {string} html_url
 * @property {string} name
 * @property {string | null} bio
 * @property {number} public_repos
 * @property {number} followers
 * @property {number} following
 */

/**
 * @typedef {object} GitHubRepo
 * @property {number} id
 * @property {string} name
 * @property {string} html_url
 * @property {string | null} description
 * @property {string} language
 * @property {number} stargazers_count
 * @property {number} forks_count
 * @property {string} updated_at
 */

// --- UTILITY / CUSTOM HOOKS ---
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

// --- API & State Management Hook ---
const apiCache = new Map();

const initialState = {
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    user: null,
    repos: [],
    error: null,
};

function githubReducer(state, action) {
    switch (action.type) {
        case 'FETCH_START': return { ...initialState, status: 'loading' };
        case 'FETCH_SUCCESS': return { ...state, status: 'success', user: action.payload.user, repos: action.payload.repos };
        case 'FETCH_ERROR': return { ...state, status: 'error', error: action.payload };
        case 'RESET': return initialState;
        default: throw new Error(`Unhandled action type: ${action.type}`);
    }
}

const useGitHubUser = (username) => {
    const [state, dispatch] = useReducer(githubReducer, initialState);
    const currentUsername = useRef(username);

    useEffect(() => {
        if (!username) {
            dispatch({ type: 'RESET' });
            return;
        }
        const fetchData = async () => {
            currentUsername.current = username;
            dispatch({ type: 'FETCH_START' });
            if (apiCache.has(username)) {
                dispatch({ type: 'FETCH_SUCCESS', payload: apiCache.get(username) });
                return;
            }
            try {
                const userPromise = fetch(`https://api.github.com/users/${username}`);
                const reposPromise = fetchAllRepos(username);
                const [userRes, reposData] = await Promise.all([userPromise, reposPromise]);
                if (!userRes.ok) {
                    if (userRes.status === 404) throw new Error(`User '${username}' not found.`);
                    if (userRes.status === 403) throw new Error("API rate limit exceeded. Please try again later.");
                    throw new Error("Could not fetch user data.");
                }
                const userData = await userRes.json();
                const dataToCache = { user: userData, repos: reposData };
                apiCache.set(username, dataToCache);
                dispatch({ type: 'FETCH_SUCCESS', payload: dataToCache });
            } catch (err) {
                dispatch({ type: 'FETCH_ERROR', payload: err.message });
            }
        };
        fetchData();
    }, [username]);

    return state;
};

const fetchAllRepos = async (username) => {
    let allRepos = [];
    let page = 1;
    let reposOnPage;
    do {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`);
        if (!res.ok) throw new Error("Could not fetch repositories.");
        reposOnPage = await res.json();
        allRepos = [...allRepos, ...reposOnPage];
        page++;
    } while (reposOnPage.length === 100);
    return allRepos;
};

// --- UI Components ---

const LoadingSpinner = ({ text = "Fetching data..." }) => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-16">
        <LoaderCircle className="animate-spin h-12 w-12 mb-4" />
        <p className="text-lg font-medium">{text}</p>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-red-500 bg-red-50 p-6 rounded-lg border border-red-200 mt-6">
        <ServerCrash className="h-12 w-12 mb-4" />
        <p className="text-lg font-bold">An Error Occurred</p>
        <p className="text-center">{message}</p>
    </div>
);

const WelcomeScreen = () => (
    <div className="text-center p-8 mt-16">
        <Github className="mx-auto h-24 w-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800">GitHub Repository Explorer</h2>
        <p className="mt-2 text-gray-500">Enter a GitHub username above to start exploring their public repositories.</p>
    </div>
);

const UserProfileCard = ({ user, repos }) => {
    // --- State cho tính năng AI ---
    const [aiSummary, setAiSummary] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    // --- Hàm gọi Gemini API để phân tích ---
    const handleGenerateAiSummary = async () => {
        setIsAiLoading(true);
        setAiError(null);
        setAiSummary('');

        // 1. Chuẩn bị dữ liệu để gửi cho AI
        const topRepos = [...repos]
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 10)
            .map(repo => repo.name)
            .join(', ');

        const languages = repos
            .map(repo => repo.language)
            .filter(Boolean)
            .reduce((acc, lang) => {
                acc[lang] = (acc[lang] || 0) + 1;
                return acc;
            }, {});
        
        const topLanguages = Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0])
            .join(', ');

        // 2. Thiết kế prompt (câu lệnh) cho AI - đây là bước quan trọng (Prompt Engineering)
        const systemPrompt = "Bạn là một chuyên gia phân tích công nghệ và tuyển dụng nhân sự cấp cao. Hãy phân tích hồ sơ nhà phát triển GitHub và đưa ra một bản tóm tắt chuyên nghiệp, sâu sắc và khách quan theo dạng gạch đầu dòng.";
        const userQuery = `
            Dựa vào những thông tin sau về một lập trình viên GitHub:
            - Tên: ${user.name || user.login}
            - Bio: "${user.bio || 'Không có'}"
            - Các kho lưu trữ nổi bật (sắp xếp theo sao): ${topRepos}
            - Các ngôn ngữ lập trình sử dụng nhiều nhất: ${topLanguages}

            Hãy tạo một bản phân tích về các điểm sau:
            - **Chuyên môn chính (Main Expertise):** Họ có vẻ mạnh nhất về lĩnh vực nào (frontend, backend, data science, mobile...)?
            - **Công nghệ nổi bật (Key Technologies):** Các công nghệ, framework, hoặc ngôn ngữ cụ thể mà họ thành thạo là gì?
            - **Thế mạnh tiềm năng (Potential Strengths):** Dựa trên tên các dự án và công nghệ, họ có thể có những điểm mạnh nào (ví dụ: xây dựng hệ thống, tư duy sản phẩm, đam mê mã nguồn mở...)?
        `;

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const summary = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (summary) {
                setAiSummary(summary);
            } else {
                throw new Error("No summary was generated.");
            }

        } catch (err) {
            setAiError("Không thể tạo phân tích AI. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="w-28 h-28 rounded-full border-4 border-gray-200" />
                <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-lg text-blue-600 hover:underline flex items-center gap-1 justify-center md:justify-start">
                        @{user.login} <ExternalLink size={16} />
                    </a>
                    <p className="text-gray-600 mt-2">{user.bio || 'No bio available.'}</p>
                    <div className="flex justify-center md:justify-start gap-4 mt-4 text-sm text-gray-700">
                        <span className="font-semibold">{user.followers.toLocaleString()}</span> followers
                        <span>·</span>
                        <span className="font-semibold">{user.following.toLocaleString()}</span> following
                    </div>
                </div>
                {/* Nút kích hoạt tính năng AI */}
                <button 
                    onClick={handleGenerateAiSummary} 
                    disabled={isAiLoading}
                    className="flex-shrink-0 mt-4 md:mt-0 bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Sparkles size={16} />
                    {isAiLoading ? 'Đang phân tích...' : 'Phân tích AI'}
                </button>
            </div>

            {/* Khu vực hiển thị kết quả AI */}
            {isAiLoading && <LoadingSpinner text="AI is thinking..." />}
            {aiError && <ErrorDisplay message={aiError} />}
            {aiSummary && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Phân tích Chân dung Lập trình viên</h3>
                    <div 
                        className="prose prose-sm max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br />') }}
                    />
                </div>
            )}
        </div>
    );
};


const RepoListItem = ({ repo }) => (
    <li className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200">
        <div className="flex justify-between items-start">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-blue-700 hover:underline break-all">{repo.name}</a>
            <div className="flex items-center gap-4 text-gray-600 text-sm flex-shrink-0 ml-4">
                <span className="flex items-center gap-1"><Star size={14} /> {repo.stargazers_count.toLocaleString()}</span>
                <span className="flex items-center gap-1"><GitFork size={14} /> {repo.forks_count.toLocaleString()}</span>
            </div>
        </div>
        <p className="text-gray-600 my-2 text-sm">{repo.description || 'No description provided.'}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{repo.language || 'N/A'}</span>
            <span>Updated on {new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
    </li>
);

const RepoFilterControls = React.memo(({ onSortChange, onFilterChange, filterQuery }) => (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
            <input type="text" placeholder="Find a repository..." value={filterQuery} onChange={(e) => onFilterChange(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <select defaultValue="stars" onChange={(e) => onSortChange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
            <option value="stars">Sort by Stars</option>
            <option value="forks">Sort by Forks</option>
            <option value="updated">Sort by Last Updated</option>
        </select>
    </div>
));


const RepositoriesSection = ({ repos }) => {
    const [filterQuery, setFilterQuery] = useState('');
    const [sortOption, setSortOption] = useState('stars');
    const [currentPage, setCurrentPage] = useState(1);
    const REPOS_PER_PAGE = 10;
    const debouncedFilterQuery = useDebounce(filterQuery, 300);

    const filteredAndSortedRepos = useMemo(() => {
        return repos
            .filter(repo => repo.name.toLowerCase().includes(debouncedFilterQuery.toLowerCase()))
            .sort((a, b) => {
                switch (sortOption) {
                    case 'forks': return b.forks_count - a.forks_count;
                    case 'updated': return new Date(b.updated_at) - new Date(a.updated_at);
                    default: return b.stargazers_count - a.stargazers_count;
                }
            });
    }, [repos, debouncedFilterQuery, sortOption]);
    
    useEffect(() => { setCurrentPage(1); }, [debouncedFilterQuery, sortOption]);
    
    const paginatedRepos = useMemo(() => {
        const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
        return filteredAndSortedRepos.slice(startIndex, startIndex + REPOS_PER_PAGE);
    }, [filteredAndSortedRepos, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedRepos.length / REPOS_PER_PAGE);

    if (repos.length === 0) {
        return <div className="bg-white p-6 text-center text-gray-500 rounded-xl shadow-lg border border-gray-200">This user has no public repositories.</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Repositories ({filteredAndSortedRepos.length.toLocaleString()})</h3>
            <RepoFilterControls onSortChange={setSortOption} onFilterChange={setFilterQuery} filterQuery={filterQuery}/>
            <ul className="space-y-4">
                {paginatedRepos.map(repo => <RepoListItem key={repo.id} repo={repo} />)}
            </ul>
            {totalPages > 1 && (
                 <div className="flex justify-between items-center mt-6 pt-4 border-t">
                     <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"><ChevronLeft size={16} /> Previous</button>
                     <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                     <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300">Next <ChevronRight size={16} /></button>
                 </div>
            )}
        </div>
    );
};


// --- Main Application Component ---
export default function App() {
    const [usernameQuery, setUsernameQuery] = useState('');
    const debouncedUsername = useDebounce(usernameQuery, 500);
    const { status, user, repos, error } = useGitHubUser(debouncedUsername);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setUsernameQuery(e.target.elements.username.value);
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <nav className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xl font-bold">
                       <Github className="text-blue-600" />
                       <span>GitHub Explorer</span>
                    </div>
                    <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto flex items-center gap-2">
                        <div className="relative w-full max-w-xs">
                             <input name="username" type="text" defaultValue={usernameQuery} onChange={(e) => setUsernameQuery(e.target.value)} placeholder="Enter GitHub username" className="w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        <button type="submit" disabled={status === 'loading'} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
                            {status === 'loading' ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </nav>
            </header>
            <main className="container mx-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    {status === 'idle' && <WelcomeScreen />}
                    {status === 'loading' && <LoadingSpinner />}
                    {status === 'error' && <ErrorDisplay message={error} />}
                    {status === 'success' && user && (
                        <div className="flex flex-col gap-6">
                            <UserProfileCard user={user} repos={repos} />
                            <RepositoriesSection repos={repos} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
