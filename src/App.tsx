/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Download, FolderOpen, Smartphone } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 pb-6 text-center border-b border-gray-100">
          <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <Smartphone size={32} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">RefNet Codebase Generated</h1>
          <p className="mt-2 text-gray-500">
            The requested React Native Expo monorepo and Supabase schema have been generated in your workspace.
          </p>
        </div>
        
        <div className="p-8 bg-gray-50">
          <h2 className="text-sm border-b border-gray-200 pb-2 font-medium text-gray-900 uppercase tracking-wider mb-4 flex items-center">
            <FolderOpen size={16} className="mr-2" />
            File Structure
          </h2>
          
          <div className="space-y-4 font-mono text-sm">
            <div>
              <div className="font-semibold text-gray-800">📁 /refnet</div>
              <div className="pl-6 pt-2 space-y-2 border-l border-gray-300 ml-2">
                <div className="text-gray-600">📄 README.md</div>
                <div>
                  <div className="font-semibold text-gray-800">📁 backend/</div>
                  <div className="pl-6 pt-1 text-gray-600">📄 schema.sql <span className="text-gray-400 italic text-xs ml-2">/// Supabase Tables & RLS</span></div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">📁 frontend/</div>
                  <div className="pl-6 pt-1 space-y-1 text-gray-600">
                    <div>📄 App.tsx</div>
                    <div>📄 AuthScreen.tsx</div>
                    <div>📄 HomeScreen.tsx</div>
                    <div>📄 AddLinkScreen.tsx</div>
                    <div>📄 FriendsScreen.tsx</div>
                    <div>📄 supabaseClient.ts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="mt-1 text-gray-400">
              <Download size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">How to use</h3>
              <p className="text-sm text-gray-500 mt-1">
                Since React Native Expo cannot run directly in this Web browser preview, export this project using the Settings menu (Export as ZIP) to access the generated `/refnet` folder, or view the files in the Editor tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
