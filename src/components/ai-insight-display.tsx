import { Code2, Cpu, Sparkles, Wrench } from "../icons";
import type { AiSummaryData } from "../interfaces";
import { TechTag } from "./tech-tag";
import { StrengthItem } from "./strength-item";

export const AiInsightDisplay = ({ insightData }: { insightData: AiSummaryData | null }) => {
  if (!insightData) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h4 className="text-lg font-semibold flex items-center gap-3 text-gray-900">
          <span className="flex items-center justify-center bg-blue-100 rounded-full p-2">
            <Sparkles className="text-blue-600" width={20} height={20} />
          </span>
          Developer Insight Summary
        </h4>
      </div>

      <div className="space-y-5 text-sm">
        <div>
          <p className="text-gray-600">
            <strong className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
              <Wrench size={16} /> Main Expertise:
            </strong>{" "}
            {insightData.mainExpertise}
          </p>
        </div>

        <div>
          <strong className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Code2 size={16} /> Key Technologies:
          </strong>
          <div className="space-y-2 pl-4">
            <div className="flex items-start">
              <strong className="w-32 flex-shrink-0 text-gray-500 font-medium">Languages:</strong>
              <div className="flex flex-wrap gap-2">
                {insightData.keyTechnologies.languages.map((lang) => (
                  <TechTag key={lang}>{lang}</TechTag>
                ))}
              </div>
            </div>
            <div className="flex items-start">
              <strong className="w-32 flex-shrink-0 text-gray-500 font-medium">Frameworks:</strong>
              <div className="flex flex-wrap gap-2">
                {insightData.keyTechnologies.frameworksAndLibraries.map((fw) => (
                  <TechTag key={fw}>{fw}</TechTag>
                ))}
              </div>
            </div>
            <div className="flex items-start">
              <strong className="w-32 flex-shrink-0 text-gray-500 font-medium">Concepts:</strong>
              <div className="flex flex-wrap gap-2">
                {insightData.keyTechnologies.concepts.map((c) => (
                  <TechTag key={c}>{c}</TechTag>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <strong className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Cpu size={16} /> Potential Strengths:
          </strong>
          <ul className="space-y-2 list-outside text-gray-600 pl-4">
            {insightData.potentialStrengths.map((s) => (
              <StrengthItem key={s}>{s}</StrengthItem>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
