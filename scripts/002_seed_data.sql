-- ============================================
-- KEKEOsafari Seed Data
-- Initial data for testing and demonstration
-- ============================================

-- Insert sample tours
INSERT INTO tours (slug, title, category, description, price_per_person, min_days, max_days, image_url, highlights) VALUES
('serengeti-migration-spectacle', 'The Great Migration Spectacle', 'wildlife', 'Witness one of nature''s most magnificent events as millions of wildebeest and zebras thunder across the endless plains of the Serengeti.', 450.00, 5, 10, '/serengeti-wildebeest-migration.jpg', ARRAY['Witness the Great Migration', 'Big Five game drives', 'Hot air balloon safari', 'Professional wildlife guide', 'Luxury tented camps']),
('kilimanjaro-roof-of-africa', 'Kilimanjaro: Roof of Africa', 'adventure', 'Conquer Africa''s highest peak on an unforgettable journey through five climatic zones to stand atop the snow-capped summit.', 1200.00, 6, 9, '/kilimanjaro-summit-sunrise.jpg', ARRAY['Summit Uhuru Peak (5,895m)', 'Machame Route trek', 'Expert mountain guides', 'All camping equipment', 'Certificate of achievement']),
('maasai-cultural-immersion', 'Maasai Cultural Immersion', 'culture', 'Step into the ancient world of the Maasai people and experience their rich traditions, from cattle herding to traditional ceremonies.', 280.00, 2, 4, '/maasai-traditional-dance.jpg', ARRAY['Visit authentic Maasai villages', 'Traditional dance ceremonies', 'Learn about Maasai culture', 'Craft workshop participation', 'Local guide from Maasai community']),
('zanzibar-island-paradise', 'Zanzibar Island Paradise', 'beach', 'Unwind on pristine white-sand beaches where turquoise waters meet swaying palms, and explore the ancient spice routes of Stone Town.', 320.00, 3, 7, '/zanzibar-beach-sunset.jpg', ARRAY['Pristine beach relaxation', 'Stone Town UNESCO site tour', 'Spice plantation visit', 'Snorkeling in coral reefs', 'Sunset dhow cruise']);

-- Insert sample reviews
INSERT INTO reviews (customer_name, customer_country, rating, title, review_text, tour_date, is_featured, is_approved) VALUES
('Sarah Mitchell', 'United States', 5, 'Trip of a Lifetime!', 'The Great Migration was absolutely breathtaking. Our guide was knowledgeable and passionate, making every moment educational and exciting. The accommodations exceeded our expectations. This safari changed my life!', '2024-08-15', true, true),
('James Thompson', 'United Kingdom', 5, 'Unforgettable Kilimanjaro Adventure', 'Reaching the summit of Kilimanjaro was the hardest thing I''ve ever done, but also the most rewarding. The KEKEOsafari team was incredible - professional, encouraging, and made sure we were safe every step of the way.', '2024-07-22', true, true),
('Maria Rodriguez', 'Spain', 5, 'Authentic Cultural Experience', 'The Maasai cultural tour was deeply moving and eye-opening. We learned so much about their traditions and way of life. Our Maasai guide shared stories and wisdom that I''ll never forget. Highly recommended!', '2024-09-10', true, true);

-- Insert sample blog posts
INSERT INTO blog_posts (slug, title, excerpt, content, category, author, image_url) VALUES
('ultimate-safari-packing-guide', 'The Ultimate Safari Packing Guide', 'Everything you need to know about packing for your African safari adventure, from essential gear to what to leave at home.', 'Packing for a safari can be overwhelming, but we''re here to help...', 'travel-tips', 'KEKEOsafari Team', '/safari-packing-guide.jpg'),
('understanding-big-five', 'Understanding the Big Five', 'Discover the fascinating stories behind Africa''s most iconic animals and learn how to spot them on your safari.', 'The term Big Five originally referred to the five most difficult animals to hunt on foot...', 'wildlife', 'Dr. John Kamau', '/big-five-wildlife.jpg'),
('best-time-visit-serengeti', 'When to Visit the Serengeti', 'Planning your safari timing can make all the difference. Learn about the best seasons for wildlife viewing and the Great Migration.', 'The Serengeti is spectacular year-round, but each season offers unique experiences...', 'travel-tips', 'KEKEOsafari Team', '/serengeti-seasons.jpg');
