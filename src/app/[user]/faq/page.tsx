'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import WallpaperBanner from '@/components/WallpaperBanner';
import { Plus, Minus } from 'lucide-react';

export default function FAQPage() {
  const t = useTranslations('faq');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const questions = [
    { key: 'q1', question: t('questions.q1'), answer: t('questions.a1') },
    { key: 'q2', question: t('questions.q2'), answer: t('questions.a2') },
    { key: 'q3', question: t('questions.q3'), answer: t('questions.a3') },
    { key: 'q4', question: t('questions.q4'), answer: t('questions.a4') },
    { key: 'q5', question: t('questions.q5'), answer: t('questions.a5') },
    { key: 'q6', question: t('questions.q6'), answer: t('questions.a6') },
    { key: 'q7', question: t('questions.q7'), answer: t('questions.a7') },
    { key: 'q8', question: t('questions.q8'), answer: t('questions.a8') },
    { key: 'q9', question: t('questions.q9'), answer: t('questions.a9') },
    { key: 'q10', question: t('questions.q10'), answer: t('questions.a10') },
  ];

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <WallpaperBanner />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-8">{t('title')}</h1>
          
          <div className="space-y-4">
            {questions.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-750 transition-colors"
                >
                  <span className="text-white font-medium pr-4">
                    {index + 1}. {item.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openQuestion === index ? (
                      <Minus className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Plus className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openQuestion === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 border-t border-gray-700">
                        <p className="text-gray-300 pt-4 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}