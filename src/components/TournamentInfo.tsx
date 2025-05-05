import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { HelpCircle, Award, Info, Linkedin } from 'lucide-react';

export const TournamentInfo: React.FC = () => {
  const { tournament } = useTournament();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tournament Info</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-blue-50 border-b flex items-center">
          <Info className="text-blue-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold text-blue-800">
            How to Use This App
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex space-x-4">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-medium text-lg">Add Players</h4>
              <p className="text-gray-600">
                Go to the Players tab and add all participants. You can reorder them by seed if needed.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-medium text-lg">Configure Settings</h4>
              <p className="text-gray-600">
                In the Settings tab, set the tournament name and format (Single Elimination, Double Elimination, or Round Robin).
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-medium text-lg">Generate Bracket</h4>
              <p className="text-gray-600">
                Click the "Generate Bracket" button in the Players tab to create your tournament structure.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="font-medium text-lg">Record Results</h4>
              <p className="text-gray-600">
                As matches are played, record scores and select winners in the Bracket tab. Winners automatically advance to the next round.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              5
            </div>
            <div>
              <h4 className="font-medium text-lg">Save Your Progress</h4>
              <p className="text-gray-600">
                Use the Save button to store your tournament data locally. You can also export/print your bracket when needed.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-amber-50 border-b flex items-center">
          <Award className="text-amber-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold text-amber-800">
            About Dart Tournaments
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <h4 className="font-medium text-lg">Common Dart Game Formats</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li><span className="font-medium">501:</span> Players start with 501 points and take turns throwing three darts, subtracting their score from the total. The first player to reach exactly zero wins.</li>
            <li><span className="font-medium">301:</span> Similar to 501 but starts with 301 points. Often requires a double to start scoring (double-in).</li>
            <li><span className="font-medium">Cricket:</span> Players must hit numbers 15-20 and the bullseye three times each. Strategy involves both closing numbers and scoring points.</li>
            <li><span className="font-medium">Around the Clock:</span> Players must hit each number from 1-20 in sequence. First to complete the sequence wins.</li>
          </ul>
          
          <h4 className="font-medium text-lg mt-6">Scoring Tips</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Use the score input in each match to track points (501/301) or legs won.</li>
            <li>For cricket matches, you may want to note which player closed which numbers in the notes section.</li>
            <li>Always verify scores with both players before advancing the bracket.</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-green-50 border-b flex items-center">
          <HelpCircle className="text-green-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold text-green-800">
            FAQ
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Can I edit the bracket after generation?</h4>
              <p className="text-gray-600">Yes, you can modify match results and winners at any time. Players will automatically advance based on your selections.</p>
            </div>
            
            <div>
              <h4 className="font-medium">How do byes work?</h4>
              <p className="text-gray-600">When the number of players isn't a power of 2 (4, 8, 16, etc.), some players will automatically advance to the next round (byes).</p>
            </div>
            
            <div>
              <h4 className="font-medium">Can I save multiple tournaments?</h4>
              <p className="text-gray-600">Currently, only one tournament can be saved locally. For multiple tournaments, export/print the completed brackets before starting a new one.</p>
            </div>
            
            <div>
              <h4 className="font-medium">What happens if I make a mistake?</h4>
              <p className="text-gray-600">You can always change any match result by clicking on the player you want to set as the winner. Previous selections will be updated accordingly.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-center space-x-4">
          <span className="text-gray-600">Developed by Kursat Toklucu</span>
          <a 
            href="https://www.linkedin.com/in/ktoklucu/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Linkedin className="w-5 h-5 mr-1" />
            <span>LinkedIn</span>
          </a>
        </div>
      </footer>
    </div>
  );
};