#!/usr/bin/env node

/**
 * Health Check Script for Production Deployment
 * Validates API endpoints and critical functionality
 */

const https = require('https');
const http = require('http');

const PRODUCTION_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CRITICAL_ENDPOINTS = [
  '/api/petitions',
  '/api/polls',
  '/api/surveys',
  '/api/forums',
  '/api/complaints',
  '/api/auth/signin',
  '/api/robots',
  '/api/sitemap'
];

class HealthChecker {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.results = [];
  }

  async checkEndpoint(endpoint) {
    return new Promise((resolve) => {
      const url = `${this.baseUrl}${endpoint}`;
      const module = url.startsWith('https:') ? https : http;
      
      const startTime = Date.now();
      const req = module.get(url, (res) => {
        const duration = Date.now() - startTime;
        const result = {
          endpoint,
          status: res.statusCode,
          duration,
          success: res.statusCode < 400,
          timestamp: new Date().toISOString()
        };
        
        this.results.push(result);
        
        if (result.success) {
          console.log(`✅ ${endpoint} - ${result.status} (${duration}ms)`);
        } else {
          console.log(`❌ ${endpoint} - ${result.status} (${duration}ms)`);
        }
        
        resolve(result);
      });

      req.on('error', (error) => {
        const duration = Date.now() - startTime;
        const result = {
          endpoint,
          status: 0,
          duration,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        };
        
        this.results.push(result);
        console.log(`❌ ${endpoint} - ERROR: ${error.message} (${duration}ms)`);
        resolve(result);
      });

      // Set timeout
      req.setTimeout(10000, () => {
        req.destroy();
        const result = {
          endpoint,
          status: 0,
          duration: 10000,
          success: false,
          error: 'Timeout',
          timestamp: new Date().toISOString()
        };
        
        this.results.push(result);
        console.log(`❌ ${endpoint} - TIMEOUT (10000ms)`);
        resolve(result);
      });
    });
  }

  async runHealthCheck() {
    console.log(`🏥 Starting health check for: ${this.baseUrl}\n`);
    console.log(`Time: ${new Date().toISOString()}\n`);

    // Check main page first
    await this.checkEndpoint('/');

    // Check all API endpoints
    const promises = CRITICAL_ENDPOINTS.map(endpoint => 
      this.checkEndpoint(endpoint)
    );

    await Promise.all(promises);
    this.generateReport();
  }

  generateReport() {
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const avgDuration = Math.round(
      this.results
        .filter(r => r.success)
        .reduce((sum, r) => sum + r.duration, 0) / 
      successful
    );

    console.log('\n📊 HEALTH CHECK REPORT');
    console.log('=====================================');
    console.log(`Total Endpoints: ${this.results.length}`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚡ Avg Response Time: ${avgDuration}ms`);
    console.log(`🌐 Base URL: ${this.baseUrl}`);
    
    if (failed > 0) {
      console.log('\n❌ FAILED ENDPOINTS:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`   ${r.endpoint} - ${r.error || `Status: ${r.status}`}`);
        });
    }

    // Performance warnings
    const slowEndpoints = this.results.filter(r => r.success && r.duration > 2000);
    if (slowEndpoints.length > 0) {
      console.log('\n⚠️  SLOW ENDPOINTS (>2s):');
      slowEndpoints.forEach(r => {
        console.log(`   ${r.endpoint} - ${r.duration}ms`);
      });
    }

    console.log('\n=====================================');
    
    if (failed === 0) {
      console.log('🎉 All systems operational!');
      process.exit(0);
    } else {
      console.log('⚠️  Some issues detected. Check logs above.');
      process.exit(1);
    }
  }
}

// Run health check
const checker = new HealthChecker(PRODUCTION_URL);
checker.runHealthCheck().catch(error => {
  console.error('Health check failed:', error);
  process.exit(1);
});

module.exports = HealthChecker;
