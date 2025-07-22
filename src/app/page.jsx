'use client';

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactMarkdown from 'react-markdown';

// Enhanced ScanForm with animations
const ScanForm = ({ onScan }) => {
  const [url, setUrl] = useState("");
  const [profile, setProfile] = useState("basic");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced URL validation
    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return alert("Enter a valid URL with http/https");
      }
    } catch (err) {
      return alert("Enter a valid URL with http/https");
    }

    onScan({ url, profile });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold">🔍 Scan a Website</h2>

      <input
        ref={inputRef}
        type="text"
        placeholder="https://example.com"
        className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-300 transition"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="space-y-2">
        <label className="font-medium">Scan Profile:</label>
        <div className="flex space-x-2">
          {['basic', 'standard', 'deep'].map((p) => (
            <motion.button
              key={p}
              type="button"
              className={`flex-1 py-2 px-4 rounded capitalize transition-all ${profile === p
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200'
                }`}
              onClick={() => setProfile(p)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {p}
            </motion.button>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          {profile === 'basic' && 'Fast scan for critical security headers'}
          {profile === 'standard' && 'Comprehensive scan for common vulnerabilities'}
          {profile === 'deep' && 'In-depth scan including advanced threats'}
        </div>
      </div>

      <motion.button
        type="submit"
        className="bg-blue-600 text-white px-4 py-3 rounded-lg w-full font-medium flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>🚀 Start Security Scan</span>
      </motion.button>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">How to Use:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Enter a valid URL starting with http:// or https://</li>
          <li>• Choose scan depth based on your needs</li>
          <li>• Results will show security score and vulnerabilities</li>
          <li>• Follow recommendations to improve security</li>
        </ul>
      </div>
    </motion.form>
  );
};

// Enhanced ScanResult with visualization
const ScanResult = ({ data }) => {
  if (!data) return null;

  const { scan_results: results, gemini_remediation: remediation } = data;

  // Calculate security score
  const maxPossibleIssues = 8; // Based on the checks we have
  const presentHeaders = results.security_headers?.present?.length || 0;
  const missingHeaders = results.security_headers?.missing?.length || 0;
  const otherIssues = Object.entries(results)
    .filter(([key, value]) => key !== 'security_headers' && value && value.vulnerable)
    .length;

  const issuesFound = missingHeaders + otherIssues;
  const securityScore = Math.max(0, 100 - (issuesFound / maxPossibleIssues) * 100);

  // Severity mapping
  const severityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-yellow-100 text-yellow-800'
  };

  // Improved vulnerability extraction
  const extractVulnerabilities = (text) => {
    const vulnerabilities = [];
    const lines = text.split('\n');

    let currentVuln = null;

    for (const line of lines) {
      // Check if line contains vulnerability title
      if (line.startsWith('**') && line.includes('**')) {
        // Save previous vulnerability
        if (currentVuln) vulnerabilities.push(currentVuln);

        // Extract new vulnerability title
        const titleMatch = line.match(/\*\*(.*?)\*\*/);
        if (titleMatch) {
          currentVuln = {
            title: titleMatch[1],
            content: '',
            severity: ''
          };
        }
      }
      // Check for severity information
      else if (currentVuln && line.includes('**Severity:**')) {
        const severityMatch = line.match(/\*\*Severity:\*\*\s*(\w+)/i);
        if (severityMatch) {
          currentVuln.severity = severityMatch[1].toLowerCase();
        }
      }
      // Add content to current vulnerability
      else if (currentVuln && line.trim() && !line.startsWith('Full Remediation Guide')) {
        currentVuln.content += line + '\n';
      }
    }

    // Add the last vulnerability
    if (currentVuln) vulnerabilities.push(currentVuln);

    return vulnerabilities;
  };

  const vulnerabilities = extractVulnerabilities(remediation);

  return (
    <motion.div
      className="mt-8 bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Security Score Visualization */}
        <div className="md:w-1/3 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Security Score</h2>

          <div className="w-48 h-48">
            <CircularProgressbar
              value={securityScore}
              text={`${Math.round(securityScore)}%`}
              styles={buildStyles({
                pathColor: securityScore > 80 ? '#10B981' :
                  securityScore > 50 ? '#F59E0B' : '#EF4444',
                textColor: '#1F2937',
                textSize: '24px',
                pathTransitionDuration: 1
              })}
            />
          </div>

          <div className="mt-4 text-center">
            <div className={`text-lg font-bold ${securityScore > 80 ? 'text-green-600' :
              securityScore > 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
              {securityScore > 80 ? 'Secure' :
                securityScore > 50 ? 'Moderate' : 'Vulnerable'}
            </div>
            <p className="text-gray-600 mt-2">
              {issuesFound} security {issuesFound === 1 ? 'issue' : 'issues'} found
            </p>
          </div>
        </div>

        {/* Vulnerability Details */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Vulnerability Report</h2>

          <div className="space-y-4">
            {vulnerabilities.map((vuln, index) => {
              // Determine border color based on severity
              let borderColor = 'border-red-500';
              if (vuln.severity === 'medium') borderColor = 'border-orange-500';
              if (vuln.severity === 'low') borderColor = 'border-yellow-500';

              return (
                <motion.div
                  key={index}
                  className={`border-l-4 pl-4 py-2 bg-white rounded-r ${borderColor}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-4 border rounded-md shadow-sm bg-white space-y-2">
                    {/* Header: Title + Severity */}
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-base text-gray-800">
                        {/* Sanitized text rendering */}
                        {vuln.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                      </h3>
                      {vuln.severity && (
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${severityColors[vuln.severity] || ''}`}>
                          {vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Content with sanitized text rendering */}
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {vuln.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-lg mb-2">Security Headers Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.security_headers.present?.map((header, i) => (
                <div key={i} className="flex items-center bg-green-50 p-2 rounded">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-green-700">
                    {/* Sanitized header name */}
                    {header.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                  </span>
                </div>
              ))}
              {results.security_headers.missing?.map((header, i) => (
                <div key={i} className="flex items-center bg-red-50 p-2 rounded">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-red-700">
                    {/* Sanitized header name */}
                    {header.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Remediation */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">Full Remediation Guide</h3>
        <div className="prose prose-sm max-w-none bg-white p-4 rounded overflow-auto">
          {/* Sanitized remediation content */}
          <div className="prose prose-sm bg-white p-4 rounded overflow-auto">
            <ReactMarkdown>
              {remediation}
            </ReactMarkdown>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Home Page
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const resultsRef = useRef(null);
  const scanningRef = useRef(null);

  const handleScan = async ({ url, profile }) => {
    setLoading(true);
    setResults(null);

    try {
      // Scroll to scanning indicator immediately
      setTimeout(() => {
        if (scanningRef.current) {
          scanningRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/scan`, {
        url,
        profile
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 30000,
        // Prevent axios from throwing on non-2xx responses
        validateStatus: () => true
      });

      // Validate response structure
      if (res.data && res.data.results && typeof res.data.results === 'object') {
        setResults(res.data.results);
      } else {
        throw new Error("Invalid response from server");
      }

      // Add to scan history
      setScanHistory(prev => [
        {
          url: url.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
          profile,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 4)
      ]);
    } catch (err) {
      alert("Scan failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);

      // Scroll to results when they're ready
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center items-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-lg">
              {/* Safe image rendering */}
              <img
                src="/logo.png"
                alt="DevSec Buddy Logo"
                width={80}
                height={80}
                className="h-20 w-20"
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            DevSec Buddy Security Scanner
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Scan your website for security vulnerabilities and get actionable recommendations
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScanForm onScan={handleScan} />

            {/* Scanning Indicator */}
            <div ref={scanningRef}>
              <AnimatePresence>
                {loading && (
                  <motion.div
                    className="mt-8 flex flex-col items-center p-8 bg-white rounded-xl shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                      <p className="text-lg text-gray-700">
                        Scanning website security...
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        This may take a few moments
                      </p>
                      <div className="mt-4 flex space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-3 h-3 bg-blue-500 rounded-full"
                            animate={{
                              y: [0, -10, 0],
                              transition: {
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Section */}
            <div ref={resultsRef}>
              {results && <ScanResult data={results} />}
            </div>
          </div>

          {/* Scan History */}
          <div>
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md sticky top-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">🔎 Recent Scans</h2>

              {scanHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No scan history yet
                </p>
              ) : (
                <div className="space-y-3">
                  {scanHistory.map((scan, i) => (
                    <motion.div
                      key={i}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <div className="font-medium truncate">
                        {/* Sanitized URL rendering */}
                        {scan.url}
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span className="capitalize">{scan.profile}</span>
                        <span>
                          {new Date(scan.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">About Security Scoring</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>90-100%: Excellent security</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>70-89%: Good, needs minor improvements</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span>50-69%: Moderate risk, needs attention</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Below 50%: High risk, immediate action needed</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
