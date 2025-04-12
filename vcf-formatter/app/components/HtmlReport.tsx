'use client';

interface PharmGKBGuideline {
  title: string;
  url: string;
  source: string;
}

interface PharmGKBAnnotation {
  title: string;
  url: string;
  level: string;
}

interface Phenotype {
  gene: string;
  phenotype: string;
  activity: string;
  implications: string;
  pharmgkbId?: string;
  guidelineLinks?: PharmGKBGuideline[];
}

interface Recommendation {
  drug: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
  evidenceLevel?: string;
  guidelineLinks?: PharmGKBGuideline[];
  clinicalAnnotations?: PharmGKBAnnotation[];
}

interface HtmlReportProps {
  data: {
    patientId?: string;
    reportDate: string;
    phenotypes: Phenotype[];
    recommendations: Recommendation[];
  };
}

export default function HtmlReport({ data }: HtmlReportProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">GenetoScript Report</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Patient ID: {data.patientId || 'Not provided'}</p>
        <p className="text-gray-600 dark:text-gray-300">Report Date: {data.reportDate}</p>
      </div>

      {/* Phenotypes Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Genetic Phenotypes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gene</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phenotype</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Guidelines</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.phenotypes.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.pharmgkbId ? (
                      <a
                        href={`https://www.pharmgkb.org/gene/${item.pharmgkbId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {item.gene}
                      </a>
                    ) : (
                      item.gene
                    )}
                  </td>
                  <td className="px-6 py-4">{item.phenotype}</td>
                  <td className="px-6 py-4">{item.activity}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {item.guidelineLinks?.map((link, idx) => (
                        <div key={idx}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                          >
                            {link.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Drug Recommendations</h2>
        <div className="space-y-6">
          {data.recommendations.map((item, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {item.clinicalAnnotations?.[0] ? (
                      <a
                        href={item.clinicalAnnotations[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {item.drug}
                      </a>
                    ) : (
                      item.drug
                    )}
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{item.recommendation}</p>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${item.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}
                `}>
                  {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)} Priority
                </span>
              </div>

              {/* Evidence Level */}
              {item.evidenceLevel && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Evidence Level: {item.evidenceLevel}
                  </span>
                </div>
              )}

              {/* Guidelines and Clinical Annotations */}
              <div className="mt-4 space-y-2">
                {item.guidelineLinks && item.guidelineLinks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Clinical Guidelines:</h4>
                    <ul className="mt-1 space-y-1">
                      {item.guidelineLinks.map((link, idx) => (
                        <li key={idx}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                          >
                            {link.title} ({link.source})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.clinicalAnnotations && item.clinicalAnnotations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Clinical Annotations:</h4>
                    <ul className="mt-1 space-y-1">
                      {item.clinicalAnnotations.map((annotation, idx) => (
                        <li key={idx}>
                          <a
                            href={annotation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                          >
                            {annotation.title} (Level {annotation.level})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 dark:bg-gray-700">
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Generated by GenetoScript • {new Date().toLocaleDateString()}
        </p>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1">
          This report should be reviewed by a healthcare professional
        </p>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1">
          References from <a href="https://www.pharmgkb.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">PharmGKB</a>
        </p>
      </div>
    </div>
  );
}
