export const SKILLS = [
  { 
    key: 'Q', 
    name: 'Fireball', 
    color: '#ff4400', 
    icon: '🔥', 
    cooldown: 5000,
    energyCost: 20,
    damage: 30,
    description: 'Launches a fiery projectile that deals damage to enemies in its path.',
    type: 'Targeted'
  },
  { 
    key: 'W', 
    name: 'Frost Nova', 
    color: '#00ffff', 
    icon: '❄️', 
    cooldown: 8000,
    energyCost: 20,
    damage: 15,
    description: 'Creates an explosion of frost around you, damaging and slowing nearby enemies.',
    type: 'AoE'
  },
  { 
    key: 'E', 
    name: 'Lightning', 
    color: '#ffff00', 
    icon: '⚡', 
    cooldown: 12000,
    energyCost: 20,
    damage: 25,
    description: 'Strikes the target with a powerful bolt of lightning.',
    type: 'Single Target'
  },
  { 
    key: 'R', 
    name: 'Earthquake', 
    color: '#8b4513', 
    icon: '🌋', 
    cooldown: 15000,
    energyCost: 20,
    damage: 30,
    description: 'Creates a devastating earthquake that damages all enemies in the target area.',
    type: 'Ground Targeted AoE'
  }
];