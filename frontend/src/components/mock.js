export const mockResume = `JOHN SMITH
Software Developer
Email: john.smith@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith | GitHub: github.com/johnsmith

PROFESSIONAL SUMMARY
Experienced software developer with 5 years of experience in web development, specializing in JavaScript and Python. Strong background in building scalable web applications and working with cross-functional teams.

TECHNICAL SKILLS
Programming Languages: JavaScript, Python, Java, HTML, CSS
Frameworks: React, Node.js, Express, Django
Databases: PostgreSQL, MongoDB, MySQL
Tools: Git, Docker, AWS, Jenkins

PROFESSIONAL EXPERIENCE

Software Developer | Tech Solutions Inc. | Jan 2020 - Present
• Developed web applications using React and Node.js
• Collaborated with design team to implement user interfaces
• Maintained and optimized existing codebases
• Participated in code reviews and agile development processes

Junior Developer | StartupXYZ | Jun 2018 - Dec 2019
• Built responsive websites using HTML, CSS, and JavaScript
• Worked with databases to create data-driven applications
• Assisted in testing and debugging software applications
• Learned and applied new technologies as needed

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2014-2018

PROJECTS
• E-commerce Platform: Built a full-stack e-commerce site using React and Node.js
• Task Management App: Created a task management application with user authentication
• Weather Dashboard: Developed a weather dashboard using external APIs

CERTIFICATIONS
• AWS Certified Developer Associate (2021)
• MongoDB Certified Developer (2020)`;

export const mockJobDescription = `Senior Full Stack Developer
TechCorp Solutions

Job Description:
We are seeking a Senior Full Stack Developer to join our dynamic team. The ideal candidate will have extensive experience with modern web technologies and a passion for building scalable applications.

Key Responsibilities:
• Design and develop scalable web applications using React.js and Node.js
• Work with cloud platforms, particularly AWS services (EC2, S3, RDS, Lambda)
• Implement RESTful APIs and microservices architecture
• Collaborate with cross-functional teams using Agile/Scrum methodologies
• Mentor junior developers and conduct code reviews
• Ensure application performance, quality, and responsiveness
• Work with containerization technologies like Docker and Kubernetes
• Implement CI/CD pipelines using Jenkins or similar tools

Required Qualifications:
• Bachelor's degree in Computer Science or related field
• 5+ years of experience in full-stack development
• Strong proficiency in JavaScript, React.js, and Node.js
• Experience with AWS cloud services and infrastructure
• Knowledge of database systems (PostgreSQL, MongoDB)
• Experience with version control systems (Git)
• Familiarity with Docker and containerization
• Understanding of Agile development methodologies
• Strong problem-solving and communication skills

Preferred Qualifications:
• Experience with TypeScript
• Knowledge of Kubernetes and container orchestration
• Experience with testing frameworks (Jest, Cypress)
• Familiarity with GraphQL
• AWS certifications preferred
• Experience with CI/CD tools and DevOps practices

What We Offer:
• Competitive salary and benefits package
• Flexible work arrangements
• Professional development opportunities
• Collaborative and innovative work environment`;

export const mockCustomizedResume = `JOHN SMITH
Senior Full Stack Developer
Email: john.smith@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith | GitHub: github.com/johnsmith

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Developer with 5+ years of experience specializing in scalable web application development using React.js and Node.js. Proven expertise in AWS cloud services, microservices architecture, and Agile methodologies. Strong background in mentoring teams and implementing CI/CD pipelines with a focus on application performance and quality.

TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java, HTML5, CSS3
Frontend Frameworks: React.js, Redux, Next.js
Backend Technologies: Node.js, Express.js, RESTful APIs, Microservices
Cloud Platforms: AWS (EC2, S3, RDS, Lambda), Docker, Kubernetes
Databases: PostgreSQL, MongoDB, MySQL
DevOps & Tools: Git, Docker, Jenkins, CI/CD Pipelines, AWS DevOps
Development Methodologies: Agile, Scrum, Code Reviews, Test-Driven Development

PROFESSIONAL EXPERIENCE

Senior Software Developer | Tech Solutions Inc. | Jan 2020 - Present
• Architected and developed 15+ scalable web applications using React.js and Node.js, serving over 100K users
• Implemented microservices architecture and RESTful APIs, improving system performance by 40%
• Leveraged AWS services (EC2, S3, RDS, Lambda) for cloud infrastructure and deployment
• Mentored 3 junior developers and conducted regular code reviews to maintain code quality standards
• Collaborated with cross-functional teams using Agile/Scrum methodologies to deliver projects on time
• Containerized applications using Docker and deployed using Kubernetes for improved scalability
• Established CI/CD pipelines using Jenkins, reducing deployment time by 60%

Full Stack Developer | StartupXYZ | Jun 2018 - Dec 2019
• Built responsive, high-performance web applications using modern JavaScript frameworks
• Developed and optimized database schemas in PostgreSQL and MongoDB for data-driven applications
• Implemented comprehensive testing strategies using Jest and automated testing frameworks
• Participated in Agile development processes and sprint planning sessions
• Collaborated with design teams to ensure optimal user experience and application responsiveness

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2014-2018
Relevant Coursework: Software Engineering, Database Systems, Web Development, Algorithms

PROJECTS
• Enterprise E-commerce Platform: Architected full-stack e-commerce solution using React, Node.js, and AWS
  - Implemented microservices architecture with Docker containerization
  - Integrated payment gateways and third-party APIs
  - Achieved 99.9% uptime with auto-scaling AWS infrastructure

• Real-time Task Management System: Developed collaborative task management application
  - Built with React.js frontend and Node.js backend with WebSocket integration
  - Implemented user authentication and role-based access control
  - Deployed using Docker containers with PostgreSQL database

• Weather Analytics Dashboard: Created responsive dashboard with real-time data visualization
  - Integrated multiple external APIs for comprehensive weather data
  - Built responsive UI with React.js and implemented caching strategies
  - Deployed on AWS with automated CI/CD pipeline

CERTIFICATIONS
• AWS Certified Developer Associate (2021)
• AWS Certified Solutions Architect - Associate (2022)
• MongoDB Certified Developer (2020)
• Certified Scrum Master (CSM) (2021)

ADDITIONAL QUALIFICATIONS
• Strong problem-solving abilities with experience in system optimization and performance tuning
• Excellent communication skills with experience in client presentations and technical documentation
• Passionate about staying current with emerging technologies and development best practices
• Experience with GraphQL implementation and API optimization techniques`;

export const processResume = async (resume, jobDescription) => {
  // Mock processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    customizedResume: mockCustomizedResume,
    improvements: [
      "Added 15 relevant keywords for ATS optimization",
      "Restructured experience to match job requirements",
      "Enhanced skills section with job-specific technologies",
      "Optimized formatting for ATS scanning",
      "Tailored summary to align with role expectations"
    ],
    keywords: [
      "React.js", "Node.js", "AWS", "Docker", "Kubernetes", 
      "Microservices", "CI/CD", "Jenkins", "PostgreSQL", "MongoDB"
    ]
  };
};