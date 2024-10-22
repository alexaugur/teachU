// // export default {
// //     transform: {
// //       "^.+\\.tsx?$": "ts-jest"
// //     },
// //     moduleNameMapper: {
// //         "^@/(.*)$": "<rootDir>/src/$1"
// //       }
// //   }


//   export default {
//     transform: {
//       "^.+\\.tsx?$": "ts-jest"
//     },
//     moduleNameMapper: {
//       '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
//       '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
//       "^@/(.*)$": "<rootDir>/src/$1"
//     },
//   }
  
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
    '^lib/api$': '<rootDir>/lib/api.mock.ts',
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    transformIgnorePatterns: [
      "node_modules/(?!(variables)/)",
      '<rootDir>/src/lib/api.ts',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        // Add other paths or patterns to ignore
      ],
  };