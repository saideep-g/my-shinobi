import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">Hello Shinobi</h1>
                                <p className="text-gray-600">Project Initialized Successfully</p>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
