const { exec } = require("child_process");
const path = require("path");
const util = require("util");
const execPromise = util.promisify(exec);

const seeders = [
  "adminSeeder.js",
  "authSeeder.js",
  "bookingSeeder.js",
  "caseSeeder.js",
  "commentSeeder.js",
  "forumSeeder.js",
  "hearingSeeder.js",
  "mediatorSeeder.js",
  "postSeeder.js",
  "userSeeder.js",
];

async function runSeeder(seederFile) {
  console.log(`\n🌱 Running ${seederFile}...`);
  try {
    const { stdout, stderr } = await execPromise(
      `node ${path.join(__dirname, seederFile)}`
    );
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`❌ Error running ${seederFile}:`, error);
    process.exit(1);
  }
}

async function runAllSeeders() {
  console.log("📊 Starting database seeding...\n");

  for (const seeder of seeders) {
    await runSeeder(seeder);
  }

  console.log("\n✅ All seeders completed successfully!");
  process.exit(0);
}

runAllSeeders();
