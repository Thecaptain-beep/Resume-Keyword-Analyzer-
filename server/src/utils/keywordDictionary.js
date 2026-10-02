/**
 * Predefined Keyword Dictionary for ResumeCheck
 * Categorized technical & professional skills with aliases and importance levels.
 */

const KEYWORD_DICTIONARY = [
  // Programming Languages
  {
    name: 'Python',
    category: 'Programming',
    importance: 'High',
    aliases: ['python', 'py', 'python3']
  },
  {
    name: 'Java',
    category: 'Programming',
    importance: 'High',
    aliases: ['java', 'core java', 'j2ee']
  },
  {
    name: 'C',
    category: 'Programming',
    importance: 'Medium',
    aliases: ['c language', 'ansi c']
  },
  {
    name: 'C++',
    category: 'Programming',
    importance: 'High',
    aliases: ['c++', 'cpp', 'c plus plus']
  },
  {
    name: 'C#',
    category: 'Programming',
    importance: 'High',
    aliases: ['c#', 'csharp', 'c sharp']
  },
  {
    name: 'JavaScript',
    category: 'Programming',
    importance: 'High',
    aliases: ['javascript', 'js', 'es6', 'ecmascript']
  },
  {
    name: 'TypeScript',
    category: 'Programming',
    importance: 'High',
    aliases: ['typescript', 'ts']
  },
  {
    name: 'Go',
    category: 'Programming',
    importance: 'High',
    aliases: ['go', 'golang']
  },
  {
    name: 'Rust',
    category: 'Programming',
    importance: 'Medium',
    aliases: ['rust', 'rustlang']
  },
  {
    name: 'PHP',
    category: 'Programming',
    importance: 'Medium',
    aliases: ['php', 'php7', 'php8']
  },
  {
    name: 'Ruby',
    category: 'Programming',
    importance: 'Medium',
    aliases: ['ruby']
  },
  {
    name: 'Swift',
    category: 'Programming',
    importance: 'Medium',
    aliases: ['swift', 'swiftui']
  },
  {
    name: 'Kotlin',
    category: 'Programming',
    importance: 'Medium',
    aliases: ['kotlin']
  },

  // Frontend Technologies
  {
    name: 'HTML',
    category: 'Frontend',
    importance: 'High',
    aliases: ['html', 'html5']
  },
  {
    name: 'CSS',
    category: 'Frontend',
    importance: 'High',
    aliases: ['css', 'css3']
  },
  {
    name: 'React',
    category: 'Frontend',
    importance: 'High',
    aliases: ['react', 'react.js', 'reactjs']
  },
  {
    name: 'Angular',
    category: 'Frontend',
    importance: 'High',
    aliases: ['angular', 'angularjs', 'angular.js', 'angular 2+']
  },
  {
    name: 'Vue',
    category: 'Frontend',
    importance: 'High',
    aliases: ['vue', 'vue.js', 'vuejs']
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    importance: 'High',
    aliases: ['next.js', 'nextjs', 'next js']
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    importance: 'Medium',
    aliases: ['tailwind css', 'tailwind', 'tailwindcss']
  },
  {
    name: 'Bootstrap',
    category: 'Frontend',
    importance: 'Medium',
    aliases: ['bootstrap', 'bootstrap 5', 'bootstrap 4']
  },
  {
    name: 'React Native',
    category: 'Frontend',
    importance: 'High',
    aliases: ['react native', 'react-native']
  },
  {
    name: 'Redux',
    category: 'Frontend',
    importance: 'Medium',
    aliases: ['redux', 'redux toolkit', 'rtk']
  },
  {
    name: 'Sass',
    category: 'Frontend',
    importance: 'Low',
    aliases: ['sass', 'scss']
  },

  // Backend Technologies
  {
    name: 'Node.js',
    category: 'Backend',
    importance: 'High',
    aliases: ['node.js', 'nodejs', 'node js', 'node']
  },
  {
    name: 'Express.js',
    category: 'Backend',
    importance: 'High',
    aliases: ['express.js', 'expressjs', 'express', 'express js']
  },
  {
    name: 'Django',
    category: 'Backend',
    importance: 'High',
    aliases: ['django', 'django rest framework', 'drf']
  },
  {
    name: 'Flask',
    category: 'Backend',
    importance: 'Medium',
    aliases: ['flask']
  },
  {
    name: 'Spring Boot',
    category: 'Backend',
    importance: 'High',
    aliases: ['spring boot', 'spring-boot', 'springboot', 'spring framework']
  },
  {
    name: '.NET',
    category: 'Backend',
    importance: 'High',
    aliases: ['.net', 'dotnet', '.net core', 'asp.net', 'asp.net core']
  },
  {
    name: 'FastAPI',
    category: 'Backend',
    importance: 'Medium',
    aliases: ['fastapi', 'fast api']
  },
  {
    name: 'Ruby on Rails',
    category: 'Backend',
    importance: 'Medium',
    aliases: ['ruby on rails', 'rails']
  },
  {
    name: 'NestJS',
    category: 'Backend',
    importance: 'Medium',
    aliases: ['nestjs', 'nest.js']
  },

  // Database
  {
    name: 'SQL',
    category: 'Database',
    importance: 'High',
    aliases: ['sql', 'structured query language']
  },
  {
    name: 'MySQL',
    category: 'Database',
    importance: 'High',
    aliases: ['mysql']
  },
  {
    name: 'Microsoft SQL Server',
    category: 'Database',
    importance: 'High',
    aliases: ['microsoft sql server', 'ms sql server', 'mssql', 'sql server', 't-sql', 'tsql']
  },
  {
    name: 'PostgreSQL',
    category: 'Database',
    importance: 'High',
    aliases: ['postgresql', 'postgres', 'psql']
  },
  {
    name: 'MongoDB',
    category: 'Database',
    importance: 'High',
    aliases: ['mongodb', 'mongo']
  },
  {
    name: 'Oracle',
    category: 'Database',
    importance: 'Medium',
    aliases: ['oracle database', 'oracle db', 'pl/sql', 'oracle']
  },
  {
    name: 'Redis',
    category: 'Database',
    importance: 'High',
    aliases: ['redis']
  },
  {
    name: 'Elasticsearch',
    category: 'Database',
    importance: 'Medium',
    aliases: ['elasticsearch', 'elastic search']
  },

  // Data Analytics & Business Intelligence
  {
    name: 'Excel',
    category: 'Data',
    importance: 'Medium',
    aliases: ['excel', 'ms excel', 'microsoft excel', 'advanced excel']
  },
  {
    name: 'Power BI',
    category: 'Data',
    importance: 'High',
    aliases: ['power bi', 'powerbi', 'power-bi', 'dax']
  },
  {
    name: 'Tableau',
    category: 'Data',
    importance: 'High',
    aliases: ['tableau', 'tableau desktop']
  },
  {
    name: 'Data Analytics',
    category: 'Data',
    importance: 'High',
    aliases: ['data analytics', 'data analysis', 'analytics']
  },
  {
    name: 'Data Science',
    category: 'Data',
    importance: 'High',
    aliases: ['data science', 'datascience']
  },
  {
    name: 'Data Visualization',
    category: 'Data',
    importance: 'Medium',
    aliases: ['data visualization', 'dataviz', 'visualization']
  },
  {
    name: 'Pandas',
    category: 'Data',
    importance: 'Medium',
    aliases: ['pandas']
  },
  {
    name: 'NumPy',
    category: 'Data',
    importance: 'Medium',
    aliases: ['numpy']
  },

  // AI & Machine Learning
  {
    name: 'Artificial Intelligence',
    category: 'AI',
    importance: 'High',
    aliases: ['artificial intelligence', 'ai']
  },
  {
    name: 'Machine Learning',
    category: 'AI',
    importance: 'High',
    aliases: ['machine learning', 'machine-learning', 'ml']
  },
  {
    name: 'Deep Learning',
    category: 'AI',
    importance: 'High',
    aliases: ['deep learning', 'deep-learning', 'dl']
  },
  {
    name: 'Natural Language Processing',
    category: 'AI',
    importance: 'High',
    aliases: ['natural language processing', 'nlp']
  },
  {
    name: 'Computer Vision',
    category: 'AI',
    importance: 'High',
    aliases: ['computer vision', 'cv', 'opencv']
  },
  {
    name: 'Generative AI',
    category: 'AI',
    importance: 'High',
    aliases: ['generative ai', 'genai', 'gen ai']
  },
  {
    name: 'Large Language Models',
    category: 'AI',
    importance: 'High',
    aliases: ['large language models', 'llm', 'llms']
  },
  {
    name: 'TensorFlow',
    category: 'AI',
    importance: 'High',
    aliases: ['tensorflow', 'tensor flow']
  },
  {
    name: 'PyTorch',
    category: 'AI',
    importance: 'High',
    aliases: ['pytorch', 'py torch']
  },
  {
    name: 'Scikit-learn',
    category: 'AI',
    importance: 'Medium',
    aliases: ['scikit-learn', 'sklearn', 'scikit learn']
  },

  // Cloud Platforms
  {
    name: 'AWS',
    category: 'Cloud',
    importance: 'High',
    aliases: ['aws', 'amazon web services', 'amazon aws']
  },
  {
    name: 'Azure',
    category: 'Cloud',
    importance: 'High',
    aliases: ['azure', 'microsoft azure']
  },
  {
    name: 'Google Cloud',
    category: 'Cloud',
    importance: 'High',
    aliases: ['google cloud', 'gcp', 'google cloud platform']
  },
  {
    name: 'Cloud Computing',
    category: 'Cloud',
    importance: 'High',
    aliases: ['cloud computing', 'cloud platforms', 'cloud architecture']
  },

  // DevOps & Infrastructure
  {
    name: 'Docker',
    category: 'DevOps',
    importance: 'High',
    aliases: ['docker', 'containerization', 'containers']
  },
  {
    name: 'Kubernetes',
    category: 'DevOps',
    importance: 'High',
    aliases: ['kubernetes', 'k8s']
  },
  {
    name: 'CI/CD',
    category: 'DevOps',
    importance: 'High',
    aliases: ['ci/cd', 'ci cd', 'continuous integration', 'continuous deployment']
  },
  {
    name: 'Jenkins',
    category: 'DevOps',
    importance: 'Medium',
    aliases: ['jenkins']
  },
  {
    name: 'GitHub Actions',
    category: 'DevOps',
    importance: 'High',
    aliases: ['github actions', 'gh actions']
  },
  {
    name: 'Terraform',
    category: 'DevOps',
    importance: 'Medium',
    aliases: ['terraform', 'iac', 'infrastructure as code']
  },
  {
    name: 'Linux',
    category: 'DevOps',
    importance: 'High',
    aliases: ['linux', 'unix', 'ubuntu', 'bash', 'shell scripting']
  },

  // Developer Tools
  {
    name: 'Git',
    category: 'Tools',
    importance: 'High',
    aliases: ['git', 'version control']
  },
  {
    name: 'GitHub',
    category: 'Tools',
    importance: 'High',
    aliases: ['github']
  },
  {
    name: 'VS Code',
    category: 'Tools',
    importance: 'Medium',
    aliases: ['vs code', 'vscode', 'visual studio code']
  },
  {
    name: 'Figma',
    category: 'Tools',
    importance: 'Medium',
    aliases: ['figma', 'ui/ux design']
  },
  {
    name: 'Postman',
    category: 'Tools',
    importance: 'High',
    aliases: ['postman', 'api testing']
  },
  {
    name: 'Jira',
    category: 'Tools',
    importance: 'Medium',
    aliases: ['jira', 'confluence']
  },

  // APIs & Protocols
  {
    name: 'REST API',
    category: 'APIs',
    importance: 'High',
    aliases: ['rest api', 'rest apis', 'restful', 'restful api', 'restful apis', 'rest services']
  },
  {
    name: 'GraphQL',
    category: 'APIs',
    importance: 'High',
    aliases: ['graphql', 'apollo graphql']
  },
  {
    name: 'gRPC',
    category: 'APIs',
    importance: 'Medium',
    aliases: ['grpc']
  },
  {
    name: 'WebSockets',
    category: 'APIs',
    importance: 'Medium',
    aliases: ['websockets', 'websocket']
  },

  // Security & Authentication
  {
    name: 'Cyber Security',
    category: 'Security',
    importance: 'High',
    aliases: ['cyber security', 'cybersecurity', 'information security']
  },
  {
    name: 'Network Security',
    category: 'Security',
    importance: 'High',
    aliases: ['network security', 'firewall', 'ssl', 'tls']
  },
  {
    name: 'Authentication',
    category: 'Security',
    importance: 'High',
    aliases: ['authentication', 'auth', 'authorization', 'identity management']
  },
  {
    name: 'OAuth',
    category: 'Security',
    importance: 'High',
    aliases: ['oauth', 'oauth2', 'oauth 2.0', 'sso', 'single sign-on']
  },
  {
    name: 'JWT',
    category: 'Security',
    importance: 'High',
    aliases: ['jwt', 'json web token', 'json web tokens']
  },

  // Professional & Soft Skills
  {
    name: 'Leadership',
    category: 'Professional',
    importance: 'High',
    aliases: ['leadership', 'mentoring', 'team lead', 'technical lead']
  },
  {
    name: 'Communication',
    category: 'Professional',
    importance: 'High',
    aliases: ['communication', 'verbal communication', 'written communication', 'presentation skills']
  },
  {
    name: 'Problem Solving',
    category: 'Professional',
    importance: 'High',
    aliases: ['problem solving', 'problem-solving', 'analytical skills', 'troubleshooting']
  },
  {
    name: 'Teamwork',
    category: 'Professional',
    importance: 'High',
    aliases: ['teamwork', 'team player', 'cross-functional collaboration', 'collaboration']
  },
  {
    name: 'Project Management',
    category: 'Professional',
    importance: 'High',
    aliases: ['project management', 'delivery', 'task management', 'sprint planning']
  },
  {
    name: 'Agile',
    category: 'Professional',
    importance: 'High',
    aliases: ['agile', 'scrum', 'kanban']
  },
  {
    name: 'Critical Thinking',
    category: 'Professional',
    importance: 'Medium',
    aliases: ['critical thinking', 'decision making']
  }
];

module.exports = {
  KEYWORD_DICTIONARY
};
