// ============================================================
// Edge Athletics — Updated Google Apps Script
// COPY/PASTE REPLACEMENT for your existing deployment
//
// Changes from original:
//   1. Handles both "trainer" and "family-waitlist" form types
//   2. After appending a TRAINER row, sends a thank-you email
//      to the trainer's provided email address
//   3. Family waitlist submissions are logged to a separate
//      sheet tab (created automatically if it does not exist)
//   4. No incentive amounts are included in emails
// ============================================================

// ----- CONFIGURATION — adjust these before deploying -----
const TRAINER_SHEET_NAME   = 'Trainer Interest';   // existing sheet tab name
const WAITLIST_SHEET_NAME  = 'Family Waitlist';    // new tab (auto-created)
const FROM_NICKNAME        = 'Edge Athletics';
const CONTACT_EMAIL        = 'hello@trainwithedge.com';
// ----------------------------------------------------------

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var formType = data.formType || 'trainer';  // default to trainer for backward compat

    if (formType === 'family-waitlist') {
      handleFamilyWaitlist(data);
    } else {
      handleTrainerForm(data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// TRAINER FORM HANDLER
// ============================================================
function handleTrainerForm(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, TRAINER_SHEET_NAME);

  // Add header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Phone', 'Instagram',
      'Athletes', 'Sport'
    ]);
  }

  // Append trainer row
  sheet.appendRow([
    new Date().toISOString(),
    data.name        || '',
    data.email       || '',
    data.phone       || '',
    data.instagram   || '',
    data.athletes    || '',
    data.sport       || ''
  ]);

  // Send thank-you email to the trainer
  if (data.email) {
    sendTrainerThankYou(data.name, data.email);
  }
}

// ============================================================
// FAMILY WAITLIST HANDLER
// ============================================================
function handleFamilyWaitlist(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, WAITLIST_SHEET_NAME);

  // Add header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Parent Name', 'Email', 'Athlete Age Range',
      'Sport', 'Zip Code', 'Has Trainer'
    ]);
  }

  // Append family waitlist row
  sheet.appendRow([
    new Date().toISOString(),
    data.parentName  || '',
    data.email       || '',
    data.athleteAge  || '',
    data.sport       || '',
    data.zip         || '',
    data.hasTrainer  || ''
  ]);

  // NOTE: No thank-you email for family waitlist at this time.
  // Add sendFamilyThankYou(data.parentName, data.email) here when ready.
}

// ============================================================
// TRAINER THANK-YOU EMAIL
// Do NOT include incentive dollar amounts in this email.
// ============================================================
function sendTrainerThankYou(name, email) {
  var firstName = (name || 'Coach').split(' ')[0];

  var subject = 'Thanks for your interest in Edge Athletics';

  var htmlBody = [
    '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#2a2933;">',

    '<div style="background:#2a2933;padding:28px 32px;border-radius:8px 8px 0 0;">',
    '  <p style="margin:0;font-size:1.1rem;font-weight:700;color:#18cb96;letter-spacing:-0.01em;">',
    '    edge<span style="color:#fff;margin-left:4px;">athletics</span>',
    '  </p>',
    '  <p style="margin:4px 0 0;font-size:0.72rem;color:#8a8a8a;text-transform:uppercase;letter-spacing:0.12em;">Youth Sports Analytics</p>',
    '</div>',

    '<div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;">',

    '  <h2 style="font-size:1.3rem;font-weight:800;color:#2a2933;margin:0 0 16px;">',
    '    ' + firstName + ', you\'re on the list.',
    '  </h2>',

    '  <p style="font-size:0.95rem;color:#444;line-height:1.75;margin:0 0 16px;">',
    '    Thank you for expressing interest in Edge Athletics as a trainer. ',
    '    We\'ve added you to our early partner list and will be in touch with ',
    '    onboarding details as we move toward launch.',
    '  </p>',

    '  <p style="font-size:0.95rem;color:#444;line-height:1.75;margin:0 0 16px;">',
    '    <strong>What happens next:</strong>',
    '  </p>',

    '  <ul style="font-size:0.92rem;color:#444;line-height:1.85;margin:0 0 20px;padding-left:20px;">',
    '    <li>You\'ll receive a follow-up when early access is available for trainers.</li>',
    '    <li>We\'ll share onboarding materials — including a rollout guide, talk track, and parent email template — before you go live.</li>',
    '    <li>You\'ll get priority access ahead of the general trainer pool.</li>',
    '  </ul>',

    '  <div style="background:#f6fefb;border:1px solid rgba(24,203,150,0.2);border-radius:8px;padding:20px 24px;margin:0 0 24px;">',
    '    <p style="font-size:0.88rem;color:#444;line-height:1.75;margin:0;font-style:italic;">',
    '      "Make performance measurable. Make progress visible. Make development smarter." ',
    '      That is what Edge Athletics is built to do — for your athletes, and in support of your coaching.',
    '    </p>',
    '  </div>',

    '  <p style="font-size:0.9rem;color:#777;line-height:1.7;margin:0 0 8px;">',
    '    Questions in the meantime? Reach out at ',
    '    <a href="mailto:' + CONTACT_EMAIL + '" style="color:#12a87c;">' + CONTACT_EMAIL + '</a>.',
    '  </p>',

    '  <p style="font-size:0.9rem;color:#777;line-height:1.7;margin:0;">',
    '    &mdash; The Edge Athletics Team',
    '  </p>',

    '</div>',

    '<div style="background:#f8f8f8;padding:16px 32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;">',
    '  <p style="font-size:0.72rem;color:#aaa;margin:0;line-height:1.6;">',
    '    Edge Athletics &mdash; Powered by <a href="https://vsptraining.com" style="color:#aaa;">Victory Sports Performance</a>, Northport, NY.',
    '    You are receiving this because you submitted your information at trainwithedge.com.',
    '  </p>',
    '</div>',

    '</div>'
  ].join('\n');

  var plainBody = [
    firstName + ', you\'re on the list.',
    '',
    'Thank you for expressing interest in Edge Athletics as a trainer.',
    'We\'ve added you to our early partner list and will be in touch with',
    'onboarding details as we move toward launch.',
    '',
    'What happens next:',
    '- You\'ll receive a follow-up when early access is available for trainers.',
    '- We\'ll share onboarding materials before you go live.',
    '- You\'ll get priority access ahead of the general trainer pool.',
    '',
    '"Make performance measurable. Make progress visible. Make development smarter."',
    'That is what Edge Athletics is built to do — for your athletes, and in support of your coaching.',
    '',
    'Questions? Reach out at ' + CONTACT_EMAIL + '.',
    '',
    '— The Edge Athletics Team',
    '',
    'Edge Athletics — Powered by Victory Sports Performance, Northport, NY.',
  ].join('\n');

  GmailApp.sendEmail(email, subject, plainBody, {
    htmlBody: htmlBody,
    name: FROM_NICKNAME,
    replyTo: CONTACT_EMAIL
  });
}

// ============================================================
// UTILITY: Get or create a sheet tab by name
// ============================================================
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

// ============================================================
// TEST FUNCTION — Run this manually in the Apps Script editor
// to confirm email sends correctly WITHOUT hitting production.
// ============================================================
function testTrainerEmail() {
  // Change this to your own email address before running
  var TEST_EMAIL = 'your-test-email@example.com';
  sendTrainerThankYou('Test Coach', TEST_EMAIL);
  Logger.log('Test email sent to ' + TEST_EMAIL);
}
