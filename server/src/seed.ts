import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Admin } from './models/Admin.js';
import { Story } from './models/Story.js';

dotenv.config();

const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/dropyourstories';

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connStr);
    }

    console.log('[Seed] Checking admin account...');
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await Admin.create({
        username: 'admin',
        passwordHash,
        name: 'Aarav Sharma',
        bio: 'Writer, thinker, and collector of quiet moments. Documenting life through words in Hindi and English.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      });
      console.log('[Seed] Created default admin (Username: admin, Password: password123)');
    }

    const storyCount = await Story.countDocuments();
    if (storyCount === 0) {
      console.log('[Seed] Seeding sample stories in English, Hindi, and Mixed language...');

      const sampleStories = [
        {
          title: 'The Art of Noticing the Quiet Morning Hours',
          slug: 'art-of-noticing-quiet-morning-hours',
          excerpt: 'Some places become memories before we even realize we are making them. A reflection on coffee, early light, and slow living.',
          content: `
            <p class="lead">Some places become memories before we even realize we are making them. There is a specific quality to the early morning air before the world resumes its relentless pace.</p>
            <p>I woke up at five today. The sun was barely a warm whisper on the horizon, painting the edges of the balcony in amber and soft rose. The city outside was asleep—no bustling auto-rickshaws, no distant car horns, just the gentle rustle of neem leaves in the breeze.</p>
            <h2>The Slow Ritual of Coffee</h2>
            <p>Making filter coffee in the quiet hours feels less like routine and more like a sacred pact with yourself. Watching the dark brew slowly drip through the brass percolator, smelling the rich roasted chicory note... it forces you to slow down.</p>
            <blockquote class="italic text-lg border-l-2 border-stone-400 pl-4 my-4">"In an age of speed, nothing can be more invigorating than slowness. In an age of distraction, nothing can be more luxurious than paying attention."</blockquote>
            <p>We often rush toward goals without remembering that life is lived in these unscripted, unrecorded gaps between actions. Today, I decided to sit on the step for twenty minutes doing absolutely nothing.</p>
            <h3>Lessons from Silence</h3>
            <ul>
              <li><strong>Notice the small details:</strong> The pattern of light shifting across the wooden table.</li>
              <li><strong>Resist immediate digital entry:</strong> Keep the phone away for the first hour.</li>
              <li><strong>Write for yourself first:</strong> Before any audience, write to capture your own truth.</li>
            </ul>
            <p>If you are reading this, take three slow breaths right now. Look out of your window. The world is carrying so much, but this moment belongs entirely to you.</p>
          `,
          featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          language: 'en',
          fontFamily: 'lora',
          category: 'Reflection',
          tags: ['Morning', 'Mindfulness', 'Slow Living'],
          status: 'PUBLIC',
          readingTime: 4,
          publishedAt: new Date(Date.now() - 86400000 * 2)
        },
        {
          title: 'पुराने शहर की गलियां और चाय का एक प्याला',
          slug: 'purane-seher-ki-galiyan-chai',
          excerpt: 'कभी-कभी ज़िंदगी हमें उन रास्तों पर ले जाती है जिनके बारे में हमने कभी सोचा भी नहीं होता। पुरानी दिल्ली की शाम का एक किस्सा।',
          content: `
            <p class="lead">कभी-कभी ज़िंदगी हमें उन रास्तों पर ले जाती है जिनके बारे में हमने कभी सोचा भी नहीं होता। हर शहर की अपनी एक खुशबू होती है, पर पुराने शहर की खुशबू में इतिहास, यादें और ठहराव मिला होता है।</p>
            <p>कल शाम जब बारिश हल्की-हल्की बूंदों में तब्दील हो रही थी, मैं पुरानी गलियों में टहल रहा था। पीली रोशनी से जगमगाती दुकानें, समोसों की भीनी-भीनी महक और कुल्हड़ में उबलती अद्रक वाली चाय।</p>
            <h2>पुराने मकान और नई कहानियां</h2>
            <p>उन लकड़ी की नक्काशीदार खिड़कियों को देखकर लगा कि कितने मौसम, कितनी पीढ़ियां और कितने राज इन दीवारों ने सम्भाले होंगे। वहां एक बुजुर्ग बैठ कर अखबार पढ़ रहे थे—बिना किसी जल्दबाजी के।</p>
            <blockquote class="italic text-lg border-l-2 border-amber-600 pl-4 my-4">"बातों का सिलसिला तो चाय के साथ शुरू होता है, बाकी सब तो सिर्फ औपचारिकताएं हैं।"</blockquote>
            <p>आज की भागदौड़ भरी जिंदगी में हम अक्सर भूल जाते हैं कि कभी-कभार रुकना कितना जरूरी है। उस छोटे से चाय के स्टाल पर बैठे-बैठे मैंने महसूस किया कि सुकून किसी बड़ी मंजिल में नहीं, बल्कि राह के इन छोटे-छोटे पलों में छुपा है।</p>
          `,
          featuredImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
          language: 'hi',
          fontFamily: 'noto-serif-devanagari',
          category: 'Memories',
          tags: ['Hindi', 'Chai', 'Travel', 'Nostalgia'],
          status: 'PUBLIC',
          readingTime: 3,
          publishedAt: new Date(Date.now() - 86400000 * 5)
        },
        {
          title: 'Weekend Drive to Nandi Hills: A Hinglish Journal entry',
          slug: 'weekend-drive-nandi-hills-hinglish',
          excerpt: 'Kabhi kabhi life mein kuch moments aise hote hain jo hamesha yaad reh jaate hain. A spontaneous morning drive story.',
          content: `
            <p class="lead">Kabhi kabhi life mein kuch moments aise hote hain jo hamesha yaad reh jaate hain. Last Saturday night, clock struck 3:30 AM and my friends said—"Chalo Nandi Hills chalte hain sunrise dekhne!"</p>
            <p>Normally, I am a heavy sleeper. Par us raat achanak plan bana and within fifteen minutes we were on the highway. Open windows, cold wind on the forehead, and classic 90s AR Rahman songs playing softly in the background.</p>
            <h2>Fog, Chai, and Sunrise</h2>
            <p>Jab hum hill station ke top par pahunche, the entire valley below was hidden inside a thick blanket of white fog. Aisa lag raha tha jaise hum badalon ke upar khade hain.</p>
            <p>Himalayan-style garam chai in paper cups while waiting for the first sunbeam to break through the cloud cover... that warmth was unmatched.</p>
            <blockquote class="italic text-lg border-l-2 border-stone-400 pl-4 my-4">"The best stories are never pre-planned in calendar invites; they happen in the spur of the moment."</blockquote>
            <p>It made me realize how important it is to break the routine once in a while. Drop your to-do lists, grab your key, and just drive.</p>
          `,
          featuredImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
          language: 'mixed',
          fontFamily: 'mukta',
          category: 'Travel',
          tags: ['Roadtrip', 'Bengaluru', 'Hinglish', 'Friends'],
          status: 'PUBLIC',
          readingTime: 3,
          publishedAt: new Date(Date.now() - 86400000 * 8)
        },
        {
          title: 'Unfinished Draft: Notes on Digital Solitude',
          slug: 'notes-on-digital-solitude-draft',
          excerpt: 'Draft thoughts regarding intentionally logging off and keeping a physical notebook.',
          content: `<p>Thinking about how the internet converted public writing into performance art. When we write only when observed, we lose the honest self...</p>`,
          featuredImage: '',
          language: 'en',
          fontFamily: 'georgia',
          category: 'Essays',
          tags: ['Draft', 'Writing'],
          status: 'DRAFT',
          readingTime: 2
        },
        {
          title: 'Private Journal: Personal Milestones of 2026',
          slug: 'private-journal-personal-milestones-2026',
          excerpt: 'A private reflection on growth, health goals, and personal boundaries.',
          content: `<p>This entry is private and only visible to me as the owner of DropYourStories...</p>`,
          featuredImage: '',
          language: 'en',
          fontFamily: 'inter',
          category: 'Personal',
          tags: ['Private', 'Journal'],
          status: 'PRIVATE',
          readingTime: 2
        }
      ];

      await Story.insertMany(sampleStories);
      console.log(`[Seed] Seeded ${sampleStories.length} initial stories successfully.`);
    }
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
};
