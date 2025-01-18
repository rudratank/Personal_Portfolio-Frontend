import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { AiOutlineAppstore } from 'react-icons/ai';
import { USER_SKILLS_DATA } from '@/lib/constant';
import { 
  FaHtml5, 
  FaCss3Alt, 
  FaReact, 
  FaBootstrap, 
  FaNodeJs, 
  FaDatabase, 
  FaPython 
} from 'react-icons/fa';
import { 
  SiDotnet,  
  SiJavascript, 
  SiMongodb, 
  SiMysql, 
  SiPostgresql, 
  SiTailwindcss 
} from 'react-icons/si';


const getLevelPercentage = (level) => {
  switch (level) {
    case 'Basic': return 33;
    case 'Intermediate': return 66;
    case 'Advanced': return 100;
    default: return 0;
  }
};

const AVAILABLE_ICONS = [
  { name: 'HTML', icon: FaHtml5, color: 'text-red-500' },
  { name: 'CSS', icon: FaCss3Alt, color: 'text-blue-500' },
  { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-400' },
  { name: 'React', icon: FaReact, color: 'text-blue-400' },
  { name: 'Bootstrap', icon: FaBootstrap, color: 'text-purple-500' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-teal-400' },
  { name: 'Node.js', icon: FaNodeJs, color: 'text-green-500' },
  { name: 'MongoDB', icon: SiMongodb, color: 'text-green-600' },
  { name: 'MySQL', icon: SiMysql, color: 'text-blue-600' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-indigo-600' },
  { name: 'Database', icon: FaDatabase, color: 'text-blue-700' },
  { name: 'Python', icon: FaPython, color: 'text-blue-500' },
  { name: 'ASP.NET', icon: SiDotnet, color: 'text-blue-500' },
  { name: 'C#', icon: SiDotnet, color: 'text-purple-600' },
  { name: 'Other', icon: AiOutlineAppstore, color: 'text-teal-500' }
];




const SkillCard = ({ title, skills = [], className = "" }) => (
  <Card className={`group hover:shadow-xl transition-all duration-500 ${className}`}>
    <CardContent className="p-8">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {skills.map((skill, index) => {
          // Find the matching icon from AVAILABLE_ICONS
          const iconData = AVAILABLE_ICONS.find(i => i.name === skill.icon);
          const IconComponent = iconData?.icon || AiOutlineAppstore;
          const levelPercentage = getLevelPercentage(skill.level);
          
          return (
            <div 
              key={skill.name}
              className="group/skill"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 group-hover/skill:bg-gray-100 transition-colors duration-300">
                    <IconComponent 
                      className={`${skill.iconColor} text-2xl transform group-hover/skill:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover/skill:text-blue-600 transition-colors duration-300">
                      {skill.name}
                    </h4>
                    <p className="text-sm text-gray-500">{skill.level}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-transparent border-blue-200 text-blue-700"
                >
                  {levelPercentage}%
                </Badge>
              </div>
              
              <Progress
                value={levelPercentage}
                className="h-2 bg-gray-100"
              />
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);
const SkillsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {[...Array(2)].map((_, i) => (
      <Card key={i} className="p-8">
        <Skeleton className="h-8 w-48 mb-8" />
        {[...Array(4)].map((_, j) => (
          <div key={j} className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </Card>
    ))}
  </div>
);

function Skills() {
  const [skillsData, setSkillsData] = useState({
    frontend: [],
    backend: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(USER_SKILLS_DATA);
        if (!response.ok) {
          throw new Error('Failed to fetch skills data');
        }
        const result = await response.json();
        if (result.success) {
          setSkillsData(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-20 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">My Skills</Badge>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Technical Expertise</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </div>

        {loading ? (
          <SkillsSkeleton />
        ) : error ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="flex flex-col items-center p-6">
              <Badge variant="destructive" className="mb-4">Error</Badge>
              <p className="text-red-600">Error loading skills: {error}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkillCard 
              title="Frontend Development" 
              skills={skillsData.frontend} 
            />
            <SkillCard 
              title="Backend Development" 
              skills={skillsData.backend} 
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Skills;