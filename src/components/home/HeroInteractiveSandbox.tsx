'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ShieldCheck,
  Check,
  Plus,
  Mail,
  Sparkles,
  ExternalLink,
  Zap,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

type CityKey = 'Indore' | 'Mumbai' | 'Bangalore' | 'Delhi NCR' | 'Jaipur';
type CategoryKey = 'Tech' | 'Food & Dining' | 'Fashion' | 'Finance';

interface HeroCreatorData {
  id: string;
  name: string;
  handle: string;
  platform: 'INSTAGRAM' | 'YOUTUBE';
  avatar: string;
  reach: string;
  er: string;
  authenticity: number;
  reelRate: string;
  reelRateNumeric: number;
  email: string;
}

const HERO_MATRIX: Record<CityKey, Record<CategoryKey, HeroCreatorData[]>> = {
  Indore: {
    Tech: [
      {
        id: 'ind-tech-1',
        name: 'Devansh Agrawal',
        handle: 'devanshtech_indore',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        reach: '245K Followers',
        er: '4.8% ER',
        authenticity: 96,
        reelRate: '₹18,000 / Reel',
        reelRateNumeric: 18000,
        email: 'devansh@techmp.in',
      },
      {
        id: 'ind-tech-2',
        name: 'Sagar Sharma',
        handle: 'sagar_gadgets',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
        reach: '112K Followers',
        er: '5.2% ER',
        authenticity: 95,
        reelRate: '₹14,000 / Reel',
        reelRateNumeric: 14000,
        email: 'collab@sagargadgets.in',
      },
      {
        id: 'ind-tech-3',
        name: 'Ankit Patidar',
        handle: 'indore_unbox',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        reach: '380K Followers',
        er: '6.1% ER',
        authenticity: 98,
        reelRate: '₹26,000 / Reel',
        reelRateNumeric: 26000,
        email: 'ankit@indoreunbox.in',
      },
    ],
    'Food & Dining': [
      {
        id: 'ind-food-1',
        name: 'Amar Sirohi',
        handle: 'foodieincarnate',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        reach: '1.6M Followers',
        er: '6.9% ER',
        authenticity: 98,
        reelRate: '₹1,10,000 / Reel',
        reelRateNumeric: 110000,
        email: 'amar@foodieincarnate.in',
      },
      {
        id: 'ind-food-2',
        name: 'Indori Food Explorer',
        handle: 'indori_zaika_official',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        reach: '320K Followers',
        er: '6.4% ER',
        authenticity: 97,
        reelRate: '₹25,000 / Reel',
        reelRateNumeric: 25000,
        email: 'collab@indorizaika.com',
      },
      {
        id: 'ind-food-3',
        name: 'Sarafa Street Bites',
        handle: 'sarafazaika',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        reach: '185K Followers',
        er: '5.6% ER',
        authenticity: 96,
        reelRate: '₹16,000 / Reel',
        reelRateNumeric: 16000,
        email: 'contact@sarafafood.in',
      },
    ],
    Fashion: [
      {
        id: 'ind-fash-1',
        name: 'Aditi Mandloi',
        handle: 'aditi_fashion_mp',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        reach: '210K Followers',
        er: '5.1% ER',
        authenticity: 96,
        reelRate: '₹20,000 / Reel',
        reelRateNumeric: 20000,
        email: 'aditi@mandloimedia.com',
      },
      {
        id: 'ind-fash-2',
        name: 'Megha Jain',
        handle: 'indore_style_edit',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        reach: '135K Followers',
        er: '4.9% ER',
        authenticity: 95,
        reelRate: '₹15,000 / Reel',
        reelRateNumeric: 15000,
        email: 'megha@styleedit.in',
      },
      {
        id: 'ind-fash-3',
        name: 'Yashwardhan Singh',
        handle: 'malwa_threads',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        reach: '98K Followers',
        er: '5.3% ER',
        authenticity: 97,
        reelRate: '₹12,000 / Reel',
        reelRateNumeric: 12000,
        email: 'yash@malwafits.in',
      },
    ],
    Finance: [
      {
        id: 'ind-fin-1',
        name: 'CA Prateek Joshi',
        handle: 'prateek_fintech_mp',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        reach: '310K Followers',
        er: '4.6% ER',
        authenticity: 98,
        reelRate: '₹45,000 / Reel',
        reelRateNumeric: 45000,
        email: 'prateek@wealthmp.in',
      },
      {
        id: 'ind-fin-2',
        name: 'Shruti Saxena',
        handle: 'shruti_invests',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        reach: '160K Followers',
        er: '5.2% ER',
        authenticity: 97,
        reelRate: '₹28,000 / Reel',
        reelRateNumeric: 28000,
        email: 'shruti@wealthwise.in',
      },
      {
        id: 'ind-fin-3',
        name: 'Malwa Business Insights',
        handle: 'malwabiz_pulse',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        reach: '95K Followers',
        er: '4.9% ER',
        authenticity: 96,
        reelRate: '₹22,000 / Reel',
        reelRateNumeric: 22000,
        email: 'contact@malwabiz.in',
      },
    ],
  },
  Mumbai: {
    Tech: [
      {
        id: 'mum-tech-1',
        name: 'Geeky Tech Hub',
        handle: 'mumbaitechhub',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        reach: '680K Followers',
        er: '4.8% ER',
        authenticity: 98,
        reelRate: '₹75,000 / Reel',
        reelRateNumeric: 75000,
        email: 'collab@mumbaitech.in',
      },
      {
        id: 'mum-tech-2',
        name: 'Rohan Roy',
        handle: 'rohan_unbox_mumbai',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        reach: '340K Followers',
        er: '5.1% ER',
        authenticity: 97,
        reelRate: '₹40,000 / Reel',
        reelRateNumeric: 40000,
        email: 'rohan@roytech.in',
      },
      {
        id: 'mum-tech-3',
        name: 'Priya Nambiar',
        handle: 'priyatechbytes',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        reach: '510K Followers',
        er: '5.4% ER',
        authenticity: 99,
        reelRate: '₹60,000 / Reel',
        reelRateNumeric: 60000,
        email: 'priya@techbytes.in',
      },
    ],
    'Food & Dining': [
      {
        id: 'mum-food-1',
        name: 'Bombay Food Safari',
        handle: 'bombayfoodsafari',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        reach: '540K Followers',
        er: '5.5% ER',
        authenticity: 96,
        reelRate: '₹65,000 / Reel',
        reelRateNumeric: 65000,
        email: 'safari@bombayfood.in',
      },
      {
        id: 'mum-food-2',
        name: 'Chef Sanjeev Kapoor',
        handle: 'sanjeevkapoorkhazana',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        reach: '7.4M Followers',
        er: '4.2% ER',
        authenticity: 99,
        reelRate: '₹3,50,000 / Reel',
        reelRateNumeric: 350000,
        email: 'business@sanjeevkapoor.com',
      },
      {
        id: 'mum-food-3',
        name: 'Sarah Todd Mumbai',
        handle: 'sarahtodd_in',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        reach: '420K Followers',
        er: '5.8% ER',
        authenticity: 98,
        reelRate: '₹55,000 / Reel',
        reelRateNumeric: 55000,
        email: 'mgmt@sarahtodd.in',
      },
    ],
    Fashion: [
      {
        id: 'mum-fash-1',
        name: 'Juhi Godambe',
        handle: 'juhigodambe',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        reach: '560K Followers',
        er: '4.7% ER',
        authenticity: 97,
        reelRate: '₹70,000 / Reel',
        reelRateNumeric: 70000,
        email: 'juhi@arabellapr.com',
      },
      {
        id: 'mum-fash-2',
        name: 'Siddharth Batra',
        handle: 'siddharth98batra',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        reach: '280K Followers',
        er: '5.9% ER',
        authenticity: 98,
        reelRate: '₹45,000 / Reel',
        reelRateNumeric: 45000,
        email: 'siddharth@batrastyle.com',
      },
      {
        id: 'mum-fash-3',
        name: 'Masoom Minawala',
        handle: 'masoomminawala',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        reach: '1.4M Followers',
        er: '4.5% ER',
        authenticity: 99,
        reelRate: '₹1,80,000 / Reel',
        reelRateNumeric: 180000,
        email: 'partnerships@masoom.in',
      },
    ],
    Finance: [
      {
        id: 'mum-fin-1',
        name: 'CA Rachana Ranade',
        handle: 'rachanaranade',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        reach: '4.8M Followers',
        er: '5.2% ER',
        authenticity: 99,
        reelRate: '₹2,20,000 / Reel',
        reelRateNumeric: 220000,
        email: 'business@rachanaranade.com',
      },
      {
        id: 'mum-fin-2',
        name: 'Akshat Shrivastava',
        handle: 'akshat_world',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        reach: '2.1M Followers',
        er: '6.1% ER',
        authenticity: 98,
        reelRate: '₹1,60,000 / Reel',
        reelRateNumeric: 160000,
        email: 'akshat@finworld.in',
      },
      {
        id: 'mum-fin-3',
        name: 'Dalal Street Alpha',
        handle: 'dalalstreet_alpha',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        reach: '450K Followers',
        er: '4.9% ER',
        authenticity: 97,
        reelRate: '₹85,000 / Reel',
        reelRateNumeric: 85000,
        email: 'team@dalalalpha.com',
      },
    ],
  },
  Bangalore: {
    Tech: [
      {
        id: 'blr-tech-1',
        name: 'Arun Prabhudesai',
        handle: 'trakintech',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        reach: '14.2M Followers',
        er: '5.6% ER',
        authenticity: 99,
        reelRate: '₹4,00,000 / Reel',
        reelRateNumeric: 400000,
        email: 'collab@trak.in',
      },
      {
        id: 'blr-tech-2',
        name: 'Code with Harry',
        handle: 'codewithharry',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        reach: '5.6M Followers',
        er: '6.8% ER',
        authenticity: 99,
        reelRate: '₹2,80,000 / Reel',
        reelRateNumeric: 280000,
        email: 'harry@codewithharry.com',
      },
      {
        id: 'blr-tech-3',
        name: 'Bengaluru Dev Life',
        handle: 'bengaluru_code_vlog',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        reach: '210K Followers',
        er: '5.4% ER',
        authenticity: 96,
        reelRate: '₹30,000 / Reel',
        reelRateNumeric: 30000,
        email: 'dev@bengalurulife.in',
      },
    ],
    'Food & Dining': [
      {
        id: 'blr-food-1',
        name: 'Bengaluru Food Walk',
        handle: 'bengalurufoodwalks',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        reach: '380K Followers',
        er: '5.2% ER',
        authenticity: 96,
        reelRate: '₹42,000 / Reel',
        reelRateNumeric: 42000,
        email: 'hello@foodwalks.in',
      },
      {
        id: 'blr-food-2',
        name: 'South Filter Coffee',
        handle: 'south_filter_coffee',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        reach: '260K Followers',
        er: '5.7% ER',
        authenticity: 97,
        reelRate: '₹32,000 / Reel',
        reelRateNumeric: 32000,
        email: 'mgmt@filtercoffee.in',
      },
      {
        id: 'blr-food-3',
        name: 'Chef Manu Chandra',
        handle: 'manuchandra',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        reach: '190K Followers',
        er: '4.9% ER',
        authenticity: 98,
        reelRate: '₹35,000 / Reel',
        reelRateNumeric: 35000,
        email: 'manu@bengaluruculinary.com',
      },
    ],
    Fashion: [
      {
        id: 'blr-fash-1',
        name: 'Bengaluru Minimalist',
        handle: 'blr_minimalist',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        reach: '240K Followers',
        er: '4.8% ER',
        authenticity: 96,
        reelRate: '₹28,000 / Reel',
        reelRateNumeric: 28000,
        email: 'contact@blrminimal.in',
      },
      {
        id: 'blr-fash-2',
        name: 'Shreya Kalra',
        handle: 'shreyakalra',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        reach: '310K Followers',
        er: '5.1% ER',
        authenticity: 97,
        reelRate: '₹38,000 / Reel',
        reelRateNumeric: 38000,
        email: 'shreya@kalrastyle.com',
      },
      {
        id: 'blr-fash-3',
        name: 'Indiranagar Thrifts',
        handle: 'indiranagar_thrifts',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        reach: '125K Followers',
        er: '6.2% ER',
        authenticity: 98,
        reelRate: '₹18,000 / Reel',
        reelRateNumeric: 18000,
        email: 'collab@blrthrifts.in',
      },
    ],
    Finance: [
      {
        id: 'blr-fin-1',
        name: 'Finshots Briefs',
        handle: 'finshots',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        reach: '920K Followers',
        er: '6.4% ER',
        authenticity: 99,
        reelRate: '₹95,000 / Reel',
        reelRateNumeric: 95000,
        email: 'partnerships@finshots.in',
      },
      {
        id: 'blr-fin-2',
        name: 'Pranjal Kamra',
        handle: 'pranjalkamra',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        reach: '6.2M Followers',
        er: '5.4% ER',
        authenticity: 99,
        reelRate: '₹2,50,000 / Reel',
        reelRateNumeric: 250000,
        email: 'business@pranjalkamra.com',
      },
      {
        id: 'blr-fin-3',
        name: 'Startup Angle India',
        handle: 'startup_angle_in',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        reach: '280K Followers',
        er: '5.0% ER',
        authenticity: 97,
        reelRate: '₹45,000 / Reel',
        reelRateNumeric: 45000,
        email: 'deals@startupangle.com',
      },
    ],
  },
  'Delhi NCR': {
    Tech: [
      {
        id: 'del-tech-1',
        name: 'Shlok Srivastava',
        handle: 'techburner',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        reach: '12.4M Followers',
        er: '6.2% ER',
        authenticity: 98,
        reelRate: '₹4,50,000 / Reel',
        reelRateNumeric: 450000,
        email: 'business@techburner.in',
      },
      {
        id: 'del-tech-2',
        name: 'Gaurav Chaudhary',
        handle: 'technicalguruji',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        reach: '23.5M Followers',
        er: '4.1% ER',
        authenticity: 98,
        reelRate: '₹6,00,000 / Reel',
        reelRateNumeric: 600000,
        email: 'collab@technicalguruji.in',
      },
      {
        id: 'del-tech-3',
        name: 'TechBar Official',
        handle: 'techbar',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        reach: '4.6M Followers',
        er: '5.9% ER',
        authenticity: 98,
        reelRate: '₹2,20,000 / Reel',
        reelRateNumeric: 220000,
        email: 'business@techbar.in',
      },
    ],
    'Food & Dining': [
      {
        id: 'del-food-1',
        name: 'Dilsefoodie (Karan)',
        handle: 'dilsefoodie',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        reach: '1.2M Followers',
        er: '5.6% ER',
        authenticity: 97,
        reelRate: '₹85,000 / Reel',
        reelRateNumeric: 85000,
        email: 'karan@dilsefoodie.in',
      },
      {
        id: 'del-food-2',
        name: 'Delhi Chatori Diary',
        handle: 'delhichatori',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        reach: '780K Followers',
        er: '6.4% ER',
        authenticity: 98,
        reelRate: '₹60,000 / Reel',
        reelRateNumeric: 60000,
        email: 'chatori@delhieats.com',
      },
      {
        id: 'del-food-3',
        name: 'Old Delhi Food Walks',
        handle: 'olddelhifoodie',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        reach: '340K Followers',
        er: '5.9% ER',
        authenticity: 96,
        reelRate: '₹35,000 / Reel',
        reelRateNumeric: 35000,
        email: 'walks@olddelhi.in',
      },
    ],
    Fashion: [
      {
        id: 'del-fash-1',
        name: 'Komal Pandey',
        handle: 'komalpandeyofficial',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        reach: '2.1M Followers',
        er: '4.8% ER',
        authenticity: 96,
        reelRate: '₹2,20,000 / Reel',
        reelRateNumeric: 220000,
        email: 'komal@teamkomal.com',
      },
      {
        id: 'del-fash-2',
        name: 'Dolly Singh',
        handle: 'dollysingh',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        reach: '1.7M Followers',
        er: '5.3% ER',
        authenticity: 97,
        reelRate: '₹1,60,000 / Reel',
        reelRateNumeric: 160000,
        email: 'dolly@dollysingh.in',
      },
      {
        id: 'del-fash-3',
        name: 'Kritika Khurana',
        handle: 'thatbohogirl',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        reach: '1.8M Followers',
        er: '4.6% ER',
        authenticity: 96,
        reelRate: '₹1,75,000 / Reel',
        reelRateNumeric: 175000,
        email: 'kritika@thatbohogirl.com',
      },
    ],
    Finance: [
      {
        id: 'del-fin-1',
        name: 'Labour Law Advisor',
        handle: 'labourlawadvisor',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        reach: '5.1M Followers',
        er: '6.7% ER',
        authenticity: 99,
        reelRate: '₹2,40,000 / Reel',
        reelRateNumeric: 240000,
        email: 'business@lla.in',
      },
      {
        id: 'del-fin-2',
        name: 'Ankur Warikoo',
        handle: 'ankurwarikoo',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        reach: '4.2M Followers',
        er: '5.8% ER',
        authenticity: 98,
        reelRate: '₹2,50,000 / Reel',
        reelRateNumeric: 250000,
        email: 'team@warikoo.com',
      },
      {
        id: 'del-fin-3',
        name: 'CA Neha Nagar',
        handle: 'ca_nehanagar',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        reach: '1.9M Followers',
        er: '5.1% ER',
        authenticity: 97,
        reelRate: '₹1,10,000 / Reel',
        reelRateNumeric: 110000,
        email: 'neha@fintechnagar.com',
      },
    ],
  },
  Jaipur: {
    Tech: [
      {
        id: 'jai-tech-1',
        name: 'Rajasthan Tech Guru',
        handle: 'rajasthantechguru',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        reach: '280K Followers',
        er: '5.4% ER',
        authenticity: 96,
        reelRate: '₹25,000 / Reel',
        reelRateNumeric: 25000,
        email: 'contact@rjtech.in',
      },
      {
        id: 'jai-tech-2',
        name: 'Pink City Unbox',
        handle: 'pinkcity_unbox',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
        reach: '110K Followers',
        er: '5.2% ER',
        authenticity: 95,
        reelRate: '₹14,000 / Reel',
        reelRateNumeric: 14000,
        email: 'unbox@pinkcity.in',
      },
      {
        id: 'jai-tech-3',
        name: 'Amit Saini Tech',
        handle: 'amitsaini_tech',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        reach: '160K Followers',
        er: '5.6% ER',
        authenticity: 97,
        reelRate: '₹18,000 / Reel',
        reelRateNumeric: 18000,
        email: 'amit@sainitech.in',
      },
    ],
    'Food & Dining': [
      {
        id: 'jai-food-1',
        name: 'Jaipur Food Darbar',
        handle: 'jaipurfooddarbar',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        reach: '290K Followers',
        er: '6.2% ER',
        authenticity: 97,
        reelRate: '₹24,000 / Reel',
        reelRateNumeric: 24000,
        email: 'darbar@jaipureats.com',
      },
      {
        id: 'jai-food-2',
        name: 'Royal Rajputana Flavours',
        handle: 'rajputana_flavours',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        reach: '185K Followers',
        er: '5.8% ER',
        authenticity: 96,
        reelRate: '₹18,000 / Reel',
        reelRateNumeric: 18000,
        email: 'royal@rajputana.in',
      },
      {
        id: 'jai-food-3',
        name: 'Johri Bazar Street Bites',
        handle: 'johri_street_food',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        reach: '130K Followers',
        er: '6.7% ER',
        authenticity: 98,
        reelRate: '₹15,000 / Reel',
        reelRateNumeric: 15000,
        email: 'johri@bazaareats.in',
      },
    ],
    Fashion: [
      {
        id: 'jai-fash-1',
        name: 'Jaipur Handloom Edit',
        handle: 'jaipur_handloom_couture',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        reach: '360K Followers',
        er: '5.9% ER',
        authenticity: 98,
        reelRate: '₹34,000 / Reel',
        reelRateNumeric: 34000,
        email: 'handloom@jaipurcouture.com',
      },
      {
        id: 'jai-fash-2',
        name: 'Royal Sanganer Prints',
        handle: 'sanganeri_wardrobe',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        reach: '195K Followers',
        er: '5.4% ER',
        authenticity: 97,
        reelRate: '₹22,000 / Reel',
        reelRateNumeric: 22000,
        email: 'sanganeri@prints.in',
      },
      {
        id: 'jai-fash-3',
        name: 'Ananya Shekhawat',
        handle: 'ananya_shekhawat_fits',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        reach: '140K Followers',
        er: '5.1% ER',
        authenticity: 96,
        reelRate: '₹16,000 / Reel',
        reelRateNumeric: 16000,
        email: 'ananya@shekhawat.in',
      },
    ],
    Finance: [
      {
        id: 'jai-fin-1',
        name: 'Marwadi Investor Club',
        handle: 'marwadi_investor_club',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        reach: '220K Followers',
        er: '5.7% ER',
        authenticity: 99,
        reelRate: '₹45,000 / Reel',
        reelRateNumeric: 45000,
        email: 'marwadi@investorclub.in',
      },
      {
        id: 'jai-fin-2',
        name: 'Dinesh Agrawal Trading',
        handle: 'dinesh_alpha_trader',
        platform: 'YOUTUBE',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        reach: '175K Followers',
        er: '5.3% ER',
        authenticity: 97,
        reelRate: '₹32,000 / Reel',
        reelRateNumeric: 32000,
        email: 'dinesh@alphatrader.in',
      },
      {
        id: 'jai-fin-3',
        name: 'Pink City Wealth Guide',
        handle: 'pinkcity_wealth',
        platform: 'INSTAGRAM',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        reach: '95K Followers',
        er: '4.8% ER',
        authenticity: 96,
        reelRate: '₹19,000 / Reel',
        reelRateNumeric: 19000,
        email: 'wealth@pinkcityguide.in',
      },
    ],
  },
};

export function HeroInteractiveSandbox() {
  const [selectedCity, setSelectedCity] = useState<CityKey>('Indore');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('Food & Dining');
  const [pitchAddedIds, setPitchAddedIds] = useState<Record<string, boolean>>({
    'ind-food-1': true,
  });

  const creators = HERO_MATRIX[selectedCity]?.[selectedCategory] || HERO_MATRIX['Indore']['Food & Dining'];

  const togglePitchCreator = (id: string, name: string) => {
    setPitchAddedIds((prev) => {
      const isCurrentlyAdded = !!prev[id];
      const updated = { ...prev, [id]: !isCurrentlyAdded };
      if (!isCurrentlyAdded) {
        toast.success(`${name} added to Client Pitch Roster! 📋`);
      } else {
        toast.info(`${name} removed from Pitch Roster.`);
      }
      return updated;
    });
  };

  // Compute live pitch summary for Floating HUD Badge #1
  const baseShortlistedCount = 6;
  const addedCount = Object.values(pitchAddedIds).filter(Boolean).length;
  const totalTalentCount = baseShortlistedCount + addedCount;
  const baseApprovedSpend = 96000;
  const dynamicApprovedSpend =
    baseApprovedSpend +
    creators.reduce((sum, c) => (pitchAddedIds[c.id] ? sum + c.reelRateNumeric : sum), 0);

  const formattedApprovedSpend = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(dynamicApprovedSpend);

  // Active email for Floating HUD Badge #2
  const activeFirstCreatorEmail = creators[0]?.email || 'collabs@agency.in';

  return (
    <div className="relative max-w-5xl mx-auto mt-12 sm:mt-16 w-full">
      {/* Ambient background glow: Multi-layered radial gradients */}
      <div className="pointer-events-none absolute -inset-4 sm:-inset-6 -z-10 bg-gradient-to-tr from-emerald-500/15 via-indigo-500/10 to-transparent blur-3xl opacity-80" />

      {/* Floating HUD Badge #1 (Top Right) */}
      <div className="hidden sm:flex absolute -top-4 -right-2 sm:-right-4 z-20 items-center gap-2 rounded-full border border-emerald-500/40 bg-[#0E1014]/95 px-3.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-[11px] font-mono text-zinc-300">
          Pitch Portal Generated:{' '}
          <strong className="text-white font-bold">{totalTalentCount} Talent Shortlisted</strong> •{' '}
          <strong className="text-emerald-400 font-bold">{formattedApprovedSpend} Total Approved</strong>
        </span>
      </div>

      {/* Main Preview Container (Stripe/Linear Standard) */}
      <div className="relative rounded-2xl border border-white/[0.08] bg-[#12141A]/70 backdrop-blur-2xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Top Control Bar with City & Category Filter Tabs */}
        <div className="space-y-4 border-b border-white/[0.06] pb-5">
          {/* Top row: Simulated address bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-black/60 border border-white/[0.08] px-2.5 py-1 text-[11px] font-mono text-zinc-300">
                <span className="text-emerald-400 font-semibold">creatorbase.in</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400 truncate max-w-[200px] sm:max-w-none">
                  engine/{selectedCity.toLowerCase().replace(/\s+/g, '-')}/{selectedCategory.toLowerCase().replace(/[^\w]/g, '')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Interactive Sandbox
              </span>
            </div>
          </div>

          {/* Interactive Filter Tabs Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* City Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>City:</span>
              </span>
              {(['Indore', 'Mumbai', 'Bangalore', 'Delhi NCR', 'Jaipur'] as const).map((city) => {
                const isActive = selectedCity === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20'
                        : 'bg-black/40 text-zinc-300 border border-white/[0.08] hover:border-emerald-500/40 hover:text-white'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>

            {/* Category Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mr-1 shrink-0">
                Niche:
              </span>
              {(['Tech', 'Food & Dining', 'Fashion', 'Finance'] as const).map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/25'
                        : 'bg-black/40 text-zinc-300 border border-white/[0.08] hover:border-indigo-500/40 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* C. Sample Creator Showcase Cards (2-3 High-Density Cards Side-By-Side) */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="wait">
            {creators.map((c, index) => {
              const isAdded = !!pitchAddedIds[c.id];

              return (
                <motion.div
                  key={`${selectedCity}-${selectedCategory}-${c.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="rounded-2xl border border-white/[0.08] bg-[#0E1014]/80 p-4 shadow-lg backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] group"
                >
                  <div>
                    {/* Creator Identity Header */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar with Green Verified Checkmark */}
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-white/[0.1] shrink-0 bg-zinc-800">
                          <Image
                            src={c.avatar}
                            alt={c.name}
                            width={44}
                            height={44}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                          <span
                            title="Audited & Verified Platform Reach"
                            className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 text-black flex items-center justify-center ring-2 ring-[#0E1014]"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-white truncate tracking-tight font-sans">
                              {c.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-zinc-400 font-mono truncate">
                              @{c.handle}
                            </span>
                            <span className="text-zinc-600 font-mono text-[10px]">•</span>
                            <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                              {selectedCity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Platform Icon Badge */}
                      <div
                        className={`p-1.5 rounded-lg border shrink-0 ${
                          c.platform === 'INSTAGRAM'
                            ? 'bg-pink-950/40 text-pink-400 border-pink-800/40'
                            : 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                        }`}
                      >
                        {c.platform === 'INSTAGRAM' ? (
                          <InstagramIcon className="w-3.5 h-3.5" />
                        ) : (
                          <YoutubeIcon className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>

                    {/* Real-time Metrics Grid */}
                    <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-black/50 p-2.5 border border-white/[0.06]">
                      {/* Reach */}
                      <div>
                        <span className="text-[9px] font-mono uppercase text-zinc-500 block">
                          Reach
                        </span>
                        <span className="font-mono text-white font-semibold text-xs mt-0.5 block truncate">
                          {c.reach}
                        </span>
                      </div>

                      {/* Engagement */}
                      <div>
                        <span className="text-[9px] font-mono uppercase text-zinc-500 block">
                          Engagement
                        </span>
                        <span className="text-emerald-400 font-mono font-medium text-xs mt-0.5 flex items-center gap-1">
                          <span>{c.er}</span>
                          <TrendingUp className="w-2.5 h-2.5" />
                        </span>
                      </div>

                      {/* Authenticity Score */}
                      <div className="border-t border-white/[0.05] pt-1.5">
                        <span className="text-[9px] font-mono uppercase text-zinc-500 block">
                          Authenticity
                        </span>
                        <span className="text-xs font-mono font-semibold text-zinc-200 mt-0.5 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{c.authenticity}/100</span>
                        </span>
                      </div>

                      {/* Est. Commercial */}
                      <div className="border-t border-white/[0.05] pt-1.5">
                        <span className="text-[9px] font-mono uppercase text-zinc-500 block">
                          Est. Commercial
                        </span>
                        <span className="font-mono text-emerald-300 font-semibold text-xs mt-0.5 block truncate">
                          {c.reelRate}
                        </span>
                      </div>
                    </div>

                    {/* Verified Business Email Pill */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono px-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md truncate max-w-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate text-[10px]">{c.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons on Card */}
                  <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => togglePitchCreator(c.id, c.name)}
                      className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-mono font-semibold transition-all ${
                        isAdded
                          ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/25'
                          : 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.08]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Added to Pitch ✅</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Add to Pitch +</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Banner with Live Telemetry */}
        <div className="mt-5 rounded-xl bg-black/40 border border-white/[0.06] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Real-time commercial benchmarks modeled from 10,000+ audited Indian campaign payouts.
            </span>
          </div>

          <a
            href="/pitch/sample-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-mono font-semibold"
          >
            <span>Preview Client View (/pitch/sample-demo)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Floating HUD Badge #2 (Bottom Left) */}
      <div className="hidden sm:flex absolute -bottom-4 -left-2 sm:-left-4 z-20 items-center gap-2 rounded-full border border-emerald-500/40 bg-[#0E1014]/95 px-3.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <Zap className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[11px] font-mono text-zinc-300">
          Verified Business Email Unlocked:{' '}
          <strong className="text-emerald-400 font-bold">{activeFirstCreatorEmail}</strong>
        </span>
      </div>
    </div>
  );
}
