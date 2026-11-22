-- ============================================================
--  Seed: JET Ministries canonical events
--  Run once after starting MySQL:
--    mysql -u root -p jet_website < Backend/scripts/seed-events.sql
-- ============================================================

USE jet_website;

-- Past events
INSERT IGNORE INTO `Event` (
  id, title, description, location, date, type, tag, ownership, featured, createdAt, updatedAt
) VALUES (
  UUID(),
  'Ossen Girls Mission',
  'A mission dedicated to empowering young girls through the love of Christ and community outreach.',
  'TBD',
  '2024-06-15 09:00:00',
  'PAST',
  'Mission',
  'JET Ministries',
  0,
  NOW(), NOW()
);

INSERT IGNORE INTO `Event` (
  id, title, description, location, date, type, tag, ownership, featured, createdAt, updatedAt
) VALUES (
  UUID(),
  'Impact Conference',
  'An annual conference focused on creating lasting impact in society through faith and action.',
  'TBD',
  '2024-08-20 09:00:00',
  'PAST',
  'Conference',
  'JET Ministries',
  0,
  NOW(), NOW()
);

INSERT IGNORE INTO `Event` (
  id, title, description, location, date, type, tag, ownership, featured, createdAt, updatedAt
) VALUES (
  UUID(),
  'Vision Summit',
  'A summit gathering leaders and members to align on the vision and direction of JET Ministries.',
  'TBD',
  '2024-10-10 09:00:00',
  'PAST',
  'Summit',
  'JET Ministries',
  0,
  NOW(), NOW()
);

-- Upcoming events
INSERT IGNORE INTO `Event` (
  id, title, description, location, date, type, tag, ownership, featured, createdAt, updatedAt
) VALUES (
  UUID(),
  'International Women''s Day',
  'A special celebration honouring women in the ministry and the community, highlighting their strength and contributions.',
  'TBD',
  '2027-03-08 09:00:00',
  'UPCOMING',
  'Celebration',
  'JET Ministries',
  1,
  NOW(), NOW()
);

INSERT IGNORE INTO `Event` (
  id, title, description, location, date, type, tag, ownership, featured, createdAt, updatedAt
) VALUES (
  UUID(),
  'Abacy Feed a Widow Initiative',
  'An outreach initiative dedicated to feeding and caring for widows in the community, showing the love of Christ in action.',
  'TBD',
  '2027-04-20 09:00:00',
  'UPCOMING',
  'Outreach',
  'JET Ministries',
  0,
  NOW(), NOW()
);

SELECT title, type FROM `Event` ORDER BY date;

