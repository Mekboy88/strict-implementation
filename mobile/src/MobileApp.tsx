import { BrowserRouter, Routes, Route } from 'react-router-dom';

const MobileApp = () => (
  <BrowserRouter>
    <Routes>
      <Route 
        path="/" 
        element={
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                📱 Mobile App Ready
              </h1>
              <p className="text-gray-300 text-lg">
                Your native mobile app is set up!
              </p>
              <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <p className="text-sm text-gray-400">
                  Build your mobile pages here - completely separate from desktop
                </p>
              </div>
            </div>
          </div>
        } 
      />
    </Routes>
  </BrowserRouter>
);

export default MobileApp;
