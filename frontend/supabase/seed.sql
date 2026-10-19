-- ==============================================================================
-- BUILDSPACE PRODUCTION SEED DATA SCRIPT
-- Safe mock data for development, testing, and initial staging deployment
-- ==============================================================================

-- 1. Insert Sample Hackathons
INSERT INTO public.hackathons (id, title, slug, organizer, banner_url, description, prize_pool, start_date, end_date, registration_deadline, registration_url, status, tags, rules, min_team_size, max_team_size, location)
VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Global CyberHack 2026',
    'global-cyberhack-2026',
    'DEF CON × Linux Security Foundation',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    'Offensive AI defense, privacy-preserving infrastructure, zero-day threat telemetry, and open-source systems resilience.',
    '$65,000 USD',
    NOW() + INTERVAL '10 days',
    NOW() + INTERVAL '13 days',
    NOW() + INTERVAL '7 days',
    'https://cyberhack2026.dev',
    'upcoming',
    ARRAY['Cybersecurity', 'Systems', 'AI Defense', 'Rust', 'eBPF'],
    'Teams of 2 to 4 members. 72-hour hacking window. Open-source licenses required for prize eligibility.',
    2,
    4,
    'Global Virtual'
),
(
    '00000000-0000-0000-0000-000000000002',
    'ETHGlobal DevCampus Sprint',
    'ethglobal-devcampus-sprint',
    'ETHGlobal & Web3 Academic League',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    'A 48-hour student hackathon building rollups, account abstraction wallets, and ZK identity tools.',
    '$80,000 USD',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '2 days',
    NOW() - INTERVAL '2 days',
    'https://ethglobal.com',
    'ongoing',
    ARRAY['Web3', 'Ethereum', 'ZK-SNARKs', 'Smart Contracts'],
    'Submissions require verified GitHub repo and working demo video under 3 minutes.',
    2,
    5,
    'Hybrid / Boston & Remote'
)
ON CONFLICT (slug) DO NOTHING;
