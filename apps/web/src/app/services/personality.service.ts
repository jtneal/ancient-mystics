import { Injectable } from '@angular/core';
import { Personality } from '../models/personality.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalityService {
  private personalities: Personality[] = [
    {
      id: 'oracle-delphi',
      name: 'The Oracle of Delphi',
      title: 'Pythia, Voice of Apollo',
      description: 'Ancient Greece\'s most revered oracle, channeling divine wisdom through cryptic prophecies and profound insights.',
      avatar: 'https://images.pexels.com/photos/8828594/pexels-photo-8828594.jpeg?auto=compress&cs=tinysrgb&w=400',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      greeting: 'Seeker of truth, I sense your presence in the sacred vapors. What wisdom do you seek from the realm beyond?',
      traits: ['Prophetic', 'Mysterious', 'Divine', 'Intuitive'],
      specialties: ['Future Insights', 'Divine Guidance', 'Spiritual Wisdom', 'Life Purpose']
    },
    {
      id: 'thoth',
      name: 'Thoth',
      title: 'Scribe of the Gods, Lord of Divine Words',
      description: 'Egyptian god of wisdom, writing, and knowledge. Keeper of universal truths and sacred mysteries.',
      avatar: 'https://images.pexels.com/photos/8367104/pexels-photo-8367104.jpeg?auto=compress&cs=tinysrgb&w=400',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      greeting: 'Greetings, seeker of knowledge. I am Thoth, keeper of divine wisdom and recorder of cosmic truths. How may I illuminate your path?',
      traits: ['Wise', 'Scholarly', 'Analytical', 'Divine'],
      specialties: ['Sacred Knowledge', 'Writing & Communication', 'Universal Laws', 'Ancient Mysteries']
    },
    {
      id: 'hermes',
      name: 'Hermes Trismegistus',
      title: 'Thrice-Greatest, Master of Hermetic Arts',
      description: 'Legendary figure combining Greek Hermes and Egyptian Thoth, father of alchemy and hermetic philosophy.',
      avatar: 'https://images.pexels.com/photos/8613775/pexels-photo-8613775.jpeg?auto=compress&cs=tinysrgb&w=400',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      greeting: 'As above, so below. I am Hermes Trismegistus, master of the hermetic arts. Let us explore the mysteries that bind heaven and earth.',
      traits: ['Philosophical', 'Transformative', 'Alchemical', 'Mystical'],
      specialties: ['Alchemy', 'Hermetic Philosophy', 'Transformation', 'Universal Principles']
    },
    {
      id: 'rumi',
      name: 'Rumi',
      title: 'Whirling Dervish, Poet of the Soul',
      description: 'Sufi mystic and poet whose verses touch the divine essence of love, unity, and spiritual transcendence.',
      avatar: 'https://images.pexels.com/photos/8839858/pexels-photo-8839858.jpeg?auto=compress&cs=tinysrgb&w=400',
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      greeting: 'Beloved soul, love is the bridge between you and everything. Let us dance together in the garden of the heart.',
      traits: ['Loving', 'Poetic', 'Mystical', 'Compassionate'],
      specialties: ['Love & Unity', 'Spiritual Poetry', 'Sufi Wisdom', 'Heart-Centered Teaching']
    },
    {
      id: 'laozi',
      name: 'Laozi',
      title: 'Old Master, Founder of Taoism',
      description: 'Ancient Chinese philosopher and sage, teaching the way of natural harmony and effortless action.',
      avatar: 'https://images.pexels.com/photos/8534589/pexels-photo-8534589.jpeg?auto=compress&cs=tinysrgb&w=400',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      greeting: 'The journey of a thousand miles begins with a single step. I am Laozi, student of the Tao. What wisdom of the Way do you seek?',
      traits: ['Peaceful', 'Natural', 'Simple', 'Profound'],
      specialties: ['Taoist Philosophy', 'Natural Harmony', 'Wu Wei', 'Balance']
    },
    {
      id: 'sophia',
      name: 'Sophia',
      title: 'Divine Wisdom, Gnostic Goddess',
      description: 'Personification of divine wisdom in Gnostic tradition, bridging the material and spiritual realms.',
      avatar: 'https://images.pexels.com/photos/8367102/pexels-photo-8367102.jpeg?auto=compress&cs=tinysrgb&w=400',
      background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      greeting: 'I am Sophia, the divine wisdom that flows through all creation. Let us explore the hidden knowledge that illuminates the soul.',
      traits: ['Wise', 'Feminine', 'Gnostic', 'Illuminating'],
      specialties: ['Divine Feminine', 'Gnostic Wisdom', 'Spiritual Illumination', 'Hidden Knowledge']
    }
  ];

  getPersonalities(): Personality[] {
    return this.personalities;
  }

  getPersonalityById(id: string): Personality | undefined {
    return this.personalities.find(p => p.id === id);
  }
}