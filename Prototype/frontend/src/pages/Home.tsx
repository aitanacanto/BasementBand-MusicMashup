// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
      <div
        className="min-h-screen flex flex-col justify-center items-center text-white px-6 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: "url('/wallpaperHome.png')" }}
      >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="min-h-screen flex flex-col justify-center items-center text-white px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/wallpaperHome.png')" }}
      >
        <Card className="bg-gray-900 bg-opacity-80 backdrop-blur-lg shadow-2xl p-12 rounded-3xl max-w-2xl w-full text-center border border-gray-700">
          <CardContent>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text"
            >
              🎶 Welcome to MashGenX
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-lg text-gray-500 mb-8"
            >
              Turn your favorite songs into a mashup masterpiece. Let's go !
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Link to="/autogenerate">
                <Button className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  Start Creating
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Home;
