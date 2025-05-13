// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-700 text-white px-6">
      <Card className="bg-gray-800 shadow-xl p-10 rounded-2xl max-w-xl w-full text-center">
        <CardContent>
          <h1 className="text-4xl font-bold mb-4">🎵 Welcome to Mashup Maker</h1>
          <p className="text-lg mb-6">
            Combine your favorite songs into a unique mashup. Choose from auto-generated combinations or mix manually!
          </p>
          <div className="flex flex-col gap-4">
            <Link to="/autogenerate">
              <Button className="w-full">Auto Generate Mashup</Button>
            </Link>
            <Link to="/editor">
              <Button className="w-full" variant="outline">
                Manual Mashup Editor
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;





