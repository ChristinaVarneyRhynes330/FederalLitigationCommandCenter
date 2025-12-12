import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Manually load the .env file to be 100% sure
const envPath = path.resolve(process.cwd(), '.env');
console.log(`Loading .env from: ${envPath}`);

if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} else {
    console.error("❌ ERROR: Could not find .env file at project root!");
}

// Check for keys
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log("Debug URL found:", SUPABASE_URL ? "YES" : "NO");
console.log("Debug KEY found:", SUPABASE_KEY ? "YES" : "NO");

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ FAILURE: Still missing keys. Please check your .env file content.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runTest() {
    console.log("...Attempting Database Connection...");

    const testCase = {
        title: 'Test Connection Case',
        case_number: 'TEST-002', // Changed to unique number
        court: 'Test Court',
        plaintiff: 'Test Plaintiff',
        defendant: 'Test Defendant',
        status: 'Active'
    };

    const { data, error } = await supabase
        .from('cases')
        .insert([testCase])
        .select();

    if (error) {
        console.error('❌ FAILED:', error.message);
        console.error('Details:', error.details);
    } else {
        console.log('✅ SUCCESS: Database structure matches code!');
        console.log('Inserted record:', data);
    }
}

runTest();