# Ilori Majeed — AI Agent & Automation Specialist

## Personal Brand Website

**AI Voice Agents & Automation Built for Real-World Business.**
A static portfolio site for AI voice agents (flagship), AI automation (n8n & Make.com), and AI chatbots & assistants, serving businesses across multiple industries.

Built with:
- **HTML5** semantic markup
- **Tailwind CSS** (CDN) with custom theme tokens
- **Vanilla JavaScript** for all interactivity
- **Inter** (body) + **JetBrains Mono** (logs/code) from Google Fonts

## Pages

| File | Description |
|------|-------------|
| `index.html` | Homepage — Hero, 3 core services, voice console demo, industries, workflow diagrams, case studies, tech stack, process, FAQ, contact form |
| `services.html` | Services in three categories — 01 AI Voice Agents (flagship), 02 AI Automation (n8n, Make.com), 03 AI Chatbots & Assistants |
| `portfolio.html` | Portfolio & case studies — with transparency disclosures |
| `about.html` | About page — biography, expertise, tool stack, markets |
| `contact.html` | Contact — full inquiry form + direct contact sidebar |
| `js/inquiry-form.js` | Shared form delivery (Web3Forms), honeypot, and send throttling |

## How to Run

Open `index.html` in any modern browser. No build step required.

## Contact Form Setup (required for email delivery)

Both inquiry forms (homepage `#contact` and `contact.html`) send through [Web3Forms](https://web3forms.com), which emails each submission to you. There is no server, so there is no `.env` file.

1. Go to web3forms.com, enter `ilorimajeed0@gmail.com`, and copy the access key they email you.
2. In `js/inquiry-form.js`, replace `YOUR_WEB3FORMS_ACCESS_KEY` with that key.
3. Submit a test inquiry and check your inbox (and spam folder the first time).

The access key is public by design: it can only deliver to the inbox it was registered with. Until the key is added, both forms show a "Failed to send — try WhatsApp or email" message instead of pretending to succeed.

Free plan: 250 submissions/month. Spam protection: hidden honeypot field plus a 60-second per-browser send cooldown.

## Design Tokens

| Token | Color |
|-------|-------|
| Obsidian Black | `#090316` |
| Electric Violet | `#8B5CF6` |
| Ethereal White | `#F8F7FC` |
| Lavender Mist | `#DDD6FE` |

## Responsible AI Notice

All AI systems represented in this portfolio are for **administrative support only**, with human escalation pathways in every deployment.
For healthcare clients, no system handles clinical diagnosis, medical advice, or treatment recommendations.
Voice-agent appointment booking/rescheduling is marked ⚠️ **Roadmap / Unconfirmed** until calendar integrations are deployed.

## Contact

- Email: ilorimajeed0@gmail.com
- WhatsApp: +234 907 886 6537

---
© 2024 Ilori Majeed. All rights reserved.
