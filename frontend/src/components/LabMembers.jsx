import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Mail, Linkedin, GraduationCap, Loader2, FileText } from 'lucide-react';
import { labApi } from '../services/api';

const LabMembers = () => {
  const [labMembers, setLabMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    labApi.getLabMembers()
      .then(data => setLabMembers(data))
      .catch(err => console.error('Failed to fetch lab members:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="team" className="py-20 bg-white" data-testid="team-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4" data-testid="team-heading">
            Lab Members
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Meet our dedicated team of researchers, scientists, and graduate students
            driving innovation in multiscale materials science.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {labMembers.map((member) => (
              <Card 
                key={member.id} 
                data-testid={`member-card-${member.id}`}
                className="group overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-80 overflow-hidden bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-teal-600 mb-4">
                    {member.title}
                  </p>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Research Interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.research.map((topic, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-gray-100 text-slate-700 px-2 py-1 rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    {member.cv_url && (
                      <a
                        href={member.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors"
                        data-testid={`member-cv-${member.id}`}
                      >
                        <FileText size={18} />
                        View CV
                      </a>
                    )}
                    <a
                      href={`mailto:${member.email}`}
                      className="text-slate-600 hover:text-teal-600 transition-colors duration-200"
                      aria-label="Email"
                      data-testid={`member-email-${member.id}`}
                    >
                      <Mail size={18} />
                    </a>
                    <a
                      href={member.linkedin}
                      className="text-slate-600 hover:text-teal-600 transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a>
                    <a
                      href={member.scholar}
                      className="text-slate-600 hover:text-teal-600 transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Google Scholar"
                    >
                      <GraduationCap size={18} />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LabMembers;
