const http = require('node:http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

  // --- IMAGE HANDLING ---
  if (req.url.match(/\.(jpg|jpeg|png|svg)$/)) {
    const imgPath = path.join(__dirname, req.url);
    const fileStream = fs.createReadStream(imgPath);
    
    fileStream.on('open', () => {
      res.setHeader('Content-Type', 'image/jpeg');
      fileStream.pipe(res);
    });
    
    fileStream.on('error', () => {
      res.statusCode = 404;
      res.end('Image not found');
    });
    return;
  }

  // --- HTML PAGE ---
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Allan Paul | Portfolio</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
      
      <style>
        :root {
          --primary: #2c3c7c;
          --secondary: #e3f2fd;
          --accent: #64b5f6;
          --bg-light: #f1f7ff;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --white: #ffffff;
          --shadow: 0 10px 25px -5px rgba(44, 60, 124, 0.1);
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-light);
          color: var(--text-main);
          margin: 0;
          padding: 0;
          line-height: 1.6;
        }

        /* --- NAVIGATION --- */
        nav {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(241, 247, 255, 0.8);
          backdrop-filter: blur(12px);
          z-index: 1000;
        }

        .nav-content {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
        }

        .logo { 
            font-weight: 700; 
            color: var(--primary); 
            text-decoration: none;
            font-size: 1.2rem;
        }

        .nav-links a {
          text-decoration: none;
          color: var(--text-main);
          margin-left: 25px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          transition: 0.3s;
        }

        .nav-links a:hover { color: var(--primary); }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 120px 20px 60px;
        }

        /* --- HEADER --- */
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 50px;
          margin-bottom: 100px;
          text-align: left;
        }

        .hero-text { flex: 1; }
        .hero-image { flex: 1; display: flex; justify-content: flex-end; }

        .profile-card {
          position: relative;
          background: var(--white);
          padding: 15px;
          border-radius: 25px;
          box-shadow: 15px 15px 0px rgba(44, 60, 124, 0.1);
        }

        .profile-pic {
          width: 400px;
          height: 480px;
          border-radius: 15px;
          object-fit: cover;
          display: block;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 4.5rem;
          margin: 10px 0;
          color: var(--primary);
          line-height: 1.1;
        }
        
        .subtitle {
          font-size: 0.9rem;
          color: var(--accent);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .bio { 
          max-width: 500px; 
          margin: 20px 0 40px; 
          color: var(--text-muted); 
          font-size: 1.1rem; 
        }
        
        .btn {
          background-color: var(--primary);
          color: var(--white);
          padding: 18px 45px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: 0.3s;
          display: inline-block;
        }

        /* --- SECTION TITLES --- */
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          margin: 80px 0 40px;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .section-title::after {
            content: '';
            height: 2px;
            background: var(--secondary);
            flex-grow: 1;
        }

        /* --- PROJECTS & CERTS GRID --- */
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }

        .cert-card {
          background: var(--white);
          border-radius: 15px;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: 0.3s;
          border: 1px solid #edf2f7;
        }
        .cert-card:hover { transform: translateY(-5px); }
        .cert-img-container { width: 100%; height: 180px; background: var(--secondary); overflow: hidden; }
        .cert-img-container img { width: 100%; height: 100%; object-fit: cover; }
        .cert-info { padding: 20px; }
        .cert-info h3 { margin: 0 0 5px 0; font-size: 1.1rem; color: var(--primary); }
        .cert-info .date { font-size: 0.8rem; color: var(--accent); font-weight: 600; margin-bottom: 10px; }

        /* --- FEATURED WORK --- */
        .featured-card {
          background: var(--white);
          border-radius: 20px;
          box-shadow: var(--shadow);
          margin-bottom: 50px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .featured-content { padding: 40px; }
        .featured-image-box { background: var(--secondary); padding: 20px; display: flex; align-items: center; }
        .badge { background-color: var(--secondary); color: var(--primary); padding: 6px 14px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; margin-right: 8px; }

        /* --- SKILLS & SOFT SKILLS --- */
        .skills-container { background: var(--primary); color: var(--white); padding: 50px; border-radius: 24px; margin-bottom: 60px; }
        .skill-pill { display: inline-block; padding: 10px 20px; margin: 5px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); font-size: 0.9rem; transition: 0.3s; }
        .skill-pill:hover { background: var(--white); color: var(--primary); }

        .soft-skills-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
            gap: 25px; 
        }
        
        .soft-skill-card { 
            background: var(--white); 
            padding: 25px; 
            border-radius: 20px; 
            text-align: center; 
            box-shadow: var(--shadow);
        }
        
        .soft-skill-icon-img {
          width: 100%;
          height: 160px;
          margin-bottom: 20px;
          border-radius: 15px; 
          object-fit: cover;
          display: block;
        }

        .soft-skill-card h4 {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            margin: 15px 0 10px;
        }

        .soft-skill-card p { font-size: 0.95rem; color: var(--text-muted); }

        footer { text-align: center; padding: 60px 0; border-top: 1px solid var(--secondary); color: var(--text-muted); }

        @media (max-width: 900px) {
          header { flex-direction: column-reverse; text-align: center; }
          .hero-text { display: flex; flex-direction: column; align-items: center; }
          .bio { margin: 20px auto 40px; }
          .profile-pic { width: 100%; max-width: 350px; height: auto; }
          .featured-card { grid-template-columns: 1fr; }
          h1 { font-size: 3rem; }
        }
      </style>
    </head>
    <body>

      <nav>
        <div class="nav-content">
          <a href="#" class="logo">PORTFOLIO</a>
          <div class="nav-links">
            <a href="#projects">Projects</a>
            <a href="#certifications">Certs</a>
            <a href="#skills">Skills</a>
          </div>
        </div>
      </nav>

      <div class="container">
        
        <header id="profile">
          <div class="hero-text">
            <div class="subtitle">UI/UX Designer & Frontend Developer</div>
            <h1>Allan Paul Permejo</h1>
            <p class="bio">
              Driven by the art of simplifying complexity through thoughtful UI/UX design, 
              creating experiences that feel effortless, intuitive, and genuinely useful.
            </p>
            <a href="mailto:allanpaulpermejo@gmail.com" class="btn">Get in Touch</a>
          </div>
          
          <div class="hero-image">
            <div class="profile-card">
              <img src="/profilepic.jpg" class="profile-pic" alt="Allan Paul Permejo">
            </div>
          </div>
        </header>

        <section id="projects">
          <div class="section-title">Featured Work</div>
          
          <div class="featured-card">
            <div class="featured-content">
              <span style="color: var(--accent); font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">Mobile App</span>
              <h3 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin: 10px 0;">HANAPP</h3>
              <div style="margin-bottom: 20px;">
                <span class="badge">National Hackathon Top 10</span>
                <span class="badge">C# / SQL</span>
              </div>
              <p style="color: var(--text-muted);">
                A comprehensive service marketplace connecting locals. Features real-time chat, 
                secure booking, and automated payment gateways.
              </p>
            </div>
            <div class="featured-image-box">
               <img id="hanapp-slideshow" src="/hackathoncert.jpg" style="width: 100%; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: opacity 0.5s ease-in-out;" alt="Hanapp project">
            </div>
          </div>

          <div class="grid-3">
            <div class="cert-card">
              <div class="cert-info">
                <h3>PharmaTech</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Android-based pharmacy assistant with integrated chatbot.</p>
              </div>
            </div>
            <div class="cert-card">
              <div class="cert-info">
                <h3>AteGirlPH</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Reliable home service booking platform and system.</p>
              </div>
            </div>
            <div class="cert-card">
              <div class="cert-info">
                <h3>Output Locker</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Secure book publishing system using SQL & VS.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="certifications">
          <div class="section-title">Certifications</div>
          <div class="grid-3">
            <div class="cert-card">
              <div class="cert-img-container"><img src="sqlinjection.png" alt="SQL Injection Attack Cert"></div>
              <div class="cert-info">
                <p class="date">EC-COUNCIL • 2024</p>
                <h3>SQL Injection Attacks</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Advanced defense strategies for web applications.</p>
              </div>
            </div>
            <div class="cert-card">
              <div class="cert-img-container"><img src="cybersec.png" alt="Cyber Security Cert"></div>
              <div class="cert-info">
                <p class="date">EC-COUNCIL • 2024</p>
                <h3>Cyber Security Fundamentals</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Protecting business assets in a digital-first world.</p>
              </div>
            </div>
            <div class="cert-card">
              <div class="cert-img-container"><img src="sysad.png" alt="STI Education"></div>
              <div class="cert-info">
                <p class="date">STI College • 2023</p>
                <h3>Systems Administration</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Master Linux system administration skills, 
                including system installation, configuration, and troubleshooting.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="skills">
          <div class="section-title">Technical Expertise</div>
          <div class="skills-container">
            <span class="skill-pill">Python</span>
            <span class="skill-pill">Java</span>
            <span class="skill-pill">C#</span>
            <span class="skill-pill">MySQL</span>
            <span class="skill-pill">Figma</span>
            <span class="skill-pill">SAP S4 HANA</span>
            <span class="skill-pill">Agile/Scrum</span>
          </div>

          <div class="soft-skills-grid">
            <div class="soft-skill-card">
              <img src="leadership.jpg" class="soft-skill-icon-img" alt="Leadership">
              <h4 style="color: var(--primary);">Leadership</h4>
              <p>Inspiring and managing team dynamics to achieve goals.</p>
            </div>
            <div class="soft-skill-card">
              <img src="communication.jpg" class="soft-skill-icon-img" alt="Communication">
              <h4 style="color: var(--primary);">Communication</h4>
              <p>Clear and effective exchange of technical & creative ideas.</p>
            </div>
            <div class="soft-skill-card">
              <img src="problemsolving.jpg" class="soft-skill-icon-img" alt="Problem Solving">
              <h4 style="color: var(--primary);">Problem-Solving</h4>
              <p>Critical thinking to resolve complex technical challenges.</p>
            </div>
            <div class="soft-skill-card">
              <img src="teamwork.jpg" class="soft-skill-icon-img" alt="Teamwork">
              <h4 style="color: var(--primary);">Teamwork</h4>
              <p>Reliable collaboration in cross-functional environments.</p>
            </div>
          </div>
        </section>

        <footer>
          <p>&copy; 2026 Allan Paul Permejo. All Rights Reserved.</p>
        </footer>

      </div>

      <script>
        const images = [
          '/hackathoncert.jpg', // Image 1
          '/hanapp2.jpg',       // Image 2 
          '/hanapp3.jpg',       // Image 3
          '/hanapp4.jpg'        // Image 4
        ];
        let currentIndex = 0;
        const imgElement = document.getElementById('hanapp-slideshow');

        setInterval(() => {
          currentIndex = (currentIndex + 1) % images.length;
          // Subtly fade out before changing source
          imgElement.style.opacity = 0.8;
          setTimeout(() => {
            imgElement.src = images[currentIndex];
            imgElement.style.opacity = 1;
          }, 200);
        }, 2000);
      </script>

    </body>
    </html>
  `;

  res.end(htmlContent);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});