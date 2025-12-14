export const mockHtmlResponses = [
  {
    message: "I've created a beautiful landing page for your restaurant with a warm, inviting design. The page features a hero section, menu highlights, and a reservation CTA.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Golden Spoon Restaurant</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; background: #faf8f5; color: #2d2d2d; }
    .hero { 
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      padding: 120px 40px;
      text-align: center;
    }
    .hero h1 { font-size: 3.5rem; margin-bottom: 16px; letter-spacing: 2px; }
    .hero p { font-size: 1.25rem; opacity: 0.9; max-width: 600px; margin: 0 auto 32px; }
    .cta { 
      background: #d4a574; 
      color: #1a1a2e; 
      padding: 16px 40px; 
      border: none; 
      font-size: 1rem; 
      cursor: pointer;
      letter-spacing: 1px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cta:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(212,165,116,0.3); }
    .menu { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
    .menu h2 { text-align: center; font-size: 2rem; margin-bottom: 48px; color: #1a1a2e; }
    .menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
    .dish { 
      background: white; 
      padding: 32px; 
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    .dish h3 { font-size: 1.25rem; margin-bottom: 8px; color: #1a1a2e; }
    .dish p { color: #666; line-height: 1.6; }
    .dish .price { color: #d4a574; font-size: 1.5rem; margin-top: 16px; }
  </style>
</head>
<body>
  <section class="hero">
    <h1>The Golden Spoon</h1>
    <p>Experience culinary excellence in the heart of the city. Fresh ingredients, timeless recipes, unforgettable moments.</p>
    <button class="cta">RESERVE A TABLE</button>
  </section>
  <section class="menu">
    <h2>Signature Dishes</h2>
    <div class="menu-grid">
      <div class="dish">
        <h3>Truffle Risotto</h3>
        <p>Creamy Arborio rice with black truffle, aged parmesan, and fresh herbs</p>
        <div class="price">$42</div>
      </div>
      <div class="dish">
        <h3>Pan-Seared Sea Bass</h3>
        <p>Wild-caught sea bass with lemon butter sauce and seasonal vegetables</p>
        <div class="price">$48</div>
      </div>
      <div class="dish">
        <h3>Wagyu Beef Tenderloin</h3>
        <p>Grade A5 Japanese wagyu with red wine reduction and roasted garlic</p>
        <div class="price">$85</div>
      </div>
    </div>
  </section>
</body>
</html>`
  },
  {
    message: "Here's a modern portfolio website for a creative professional. It features a clean, minimal design with smooth sections and a focus on showcasing work.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alex Morgan — Designer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #111; }
    nav { 
      padding: 24px 48px; 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      border-bottom: 1px solid #eee;
    }
    .logo { font-weight: 600; font-size: 1.125rem; }
    .nav-links a { margin-left: 32px; color: #666; text-decoration: none; transition: color 0.2s; }
    .nav-links a:hover { color: #111; }
    .hero { 
      padding: 120px 48px; 
      max-width: 900px;
    }
    .hero h1 { 
      font-size: 4rem; 
      font-weight: 600; 
      line-height: 1.1;
      margin-bottom: 24px;
    }
    .hero p { 
      font-size: 1.25rem; 
      color: #666; 
      max-width: 600px;
      line-height: 1.6;
    }
    .projects { padding: 80px 48px; background: #fafafa; }
    .projects h2 { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 48px; }
    .project-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 48px; }
    .project { 
      background: #e5e5e5; 
      height: 400px; 
      border-radius: 16px;
      display: flex;
      align-items: flex-end;
      padding: 32px;
      transition: transform 0.3s;
    }
    .project:hover { transform: scale(1.02); }
    .project h3 { font-size: 1.5rem; color: #111; }
  </style>
</head>
<body>
  <nav>
    <div class="logo">Alex Morgan</div>
    <div class="nav-links">
      <a href="#">Work</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </div>
  </nav>
  <section class="hero">
    <h1>I design digital products that people love to use.</h1>
    <p>Product designer with 8 years of experience crafting intuitive interfaces for startups and Fortune 500 companies.</p>
  </section>
  <section class="projects">
    <h2>Selected Work</h2>
    <div class="project-grid">
      <div class="project"><h3>Fintech Dashboard</h3></div>
      <div class="project"><h3>E-commerce Redesign</h3></div>
      <div class="project"><h3>Mobile Banking App</h3></div>
      <div class="project"><h3>SaaS Platform</h3></div>
    </div>
  </section>
</body>
</html>`
  },
  {
    message: "I've built a startup landing page with a bold gradient hero, feature highlights, and a clear call-to-action. Perfect for a tech product launch!",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus — The Future of Collaboration</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; }
    nav { 
      padding: 20px 48px; 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
    }
    .logo { font-weight: 700; font-size: 1.25rem; }
    .nav-btn { 
      background: #fff; 
      color: #0a0a0a; 
      padding: 10px 24px; 
      border-radius: 8px; 
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.2s;
    }
    .nav-btn:hover { opacity: 0.9; }
    .hero { 
      padding: 100px 48px 120px; 
      text-align: center;
      background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%);
    }
    .badge { 
      display: inline-block;
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 0.875rem;
      margin-bottom: 24px;
    }
    .hero h1 { 
      font-size: 4.5rem; 
      font-weight: 700; 
      line-height: 1.1;
      margin-bottom: 24px;
      background: linear-gradient(135deg, #fff 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p { 
      font-size: 1.25rem; 
      color: #a1a1aa; 
      max-width: 600px;
      margin: 0 auto 40px;
      line-height: 1.6;
    }
    .cta-group { display: flex; gap: 16px; justify-content: center; }
    .cta-primary { 
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #fff; 
      padding: 16px 32px; 
      border-radius: 12px; 
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4); }
    .cta-secondary { 
      color: #fff; 
      padding: 16px 32px; 
      border: 1px solid #333;
      border-radius: 12px; 
      text-decoration: none;
      font-weight: 500;
    }
    .features { padding: 100px 48px; max-width: 1200px; margin: 0 auto; }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
    .feature { 
      background: #111; 
      padding: 32px; 
      border-radius: 16px;
      border: 1px solid #222;
    }
    .feature-icon { 
      width: 48px; 
      height: 48px; 
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 12px; 
      margin-bottom: 20px;
    }
    .feature h3 { font-size: 1.25rem; margin-bottom: 12px; }
    .feature p { color: #71717a; line-height: 1.6; }
  </style>
</head>
<body>
  <nav>
    <div class="logo">nexus</div>
    <a href="#" class="nav-btn">Get Started</a>
  </nav>
  <section class="hero">
    <span class="badge">✨ Now in Public Beta</span>
    <h1>Collaboration without the chaos</h1>
    <p>The all-in-one workspace for modern teams. Manage projects, share ideas, and ship faster than ever before.</p>
    <div class="cta-group">
      <a href="#" class="cta-primary">Start for Free</a>
      <a href="#" class="cta-secondary">Watch Demo</a>
    </div>
  </section>
  <section class="features">
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon"></div>
        <h3>Real-time Sync</h3>
        <p>Changes appear instantly across all devices. No refresh needed.</p>
      </div>
      <div class="feature">
        <div class="feature-icon"></div>
        <h3>Smart Workflows</h3>
        <p>Automate repetitive tasks with intelligent workflow triggers.</p>
      </div>
      <div class="feature">
        <div class="feature-icon"></div>
        <h3>Team Analytics</h3>
        <p>Understand productivity patterns with actionable insights.</p>
      </div>
    </div>
  </section>
</body>
</html>`
  }
];

export const chatHistoryMock: { id: string; title: string; preview: string; createdAt: Date }[] = [
  { id: '1', title: 'Restaurant Landing Page', preview: 'Create a restaurant website...', createdAt: new Date(Date.now() - 86400000) },
  { id: '2', title: 'Portfolio Website', preview: 'Build a minimal portfolio...', createdAt: new Date(Date.now() - 172800000) },
  { id: '3', title: 'SaaS Landing', preview: 'Design a startup landing...', createdAt: new Date(Date.now() - 259200000) },
];

export function getRandomMockResponse() {
  return mockHtmlResponses[Math.floor(Math.random() * mockHtmlResponses.length)];
}
