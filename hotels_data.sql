--
-- PostgreSQL database dump
--

\restrict CuQEWRK0sqzNDcPFLAilsZ9ru6ybgK7qE3IwS2YntqGq7YBoFqr8owtRUVO69cL

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: hotels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hotels (id, title, description, latitude, longitude, price, image, created_at) FROM stdin;
10	Sterling Kodai Lake Hotel	Comfortable resort located near the scenic Kodaikanal Lake.	10.2298000	77.4865000	7000.00	/uploads/1791192896301-download-(6).jpeg	2026-10-05 10:28:56.072669
9	Hotel Lakeview Ooty	Peaceful stay near the lake with comfortable rooms and scenic surroundings.	11.3990000	76.7005000	4500.00	/uploads/1791193010728-resort.jpeg	2026-10-05 10:28:55.987651
8	The Leela Palace Chennai	Luxury seafront hotel offering comfortable accommodation and city views.	13.0167000	80.2737000	10000.00	/uploads/1791193068715-The-Leela-Palace-Chennai.jpeg	2026-10-05 10:28:55.987217
7	Taj Coromandel	Luxury hotel in central Chennai with elegant rooms and quality service.	13.0569000	80.2487000	8500.00	/uploads/1791193119342-5-Star-Luxury-Hotel-in-Chennai---Taj-Coromandel.jpeg	2026-10-05 10:28:55.973017
6	The Residency Towers Chennai	Well-connected city hotel with comfortable rooms and modern facilities.	13.0418000	80.2341000	6000.00	/uploads/1791193188898-Residency-towers,-Chennai.jpeg	2026-10-05 10:28:55.971972
5	Radisson Blu Coimbatore	Modern hotel with comfortable rooms and convenient city access.	11.0198000	76.9661000	5500.00	/uploads/1791193232620-Radissonblu.jpeg	2026-10-05 10:28:55.95922
4	Taj Savoy Hotel	Comfortable heritage hotel with peaceful surroundings and excellent hospitality.	11.4064000	76.6932000	7500.00	/uploads/1791193294408-Taj-hotel.jpeg	2026-10-05 10:28:55.923898
3	Sterling Ooty Fern Hill	Hill resort offering comfortable rooms and beautiful mountain views.	11.4035000	76.6972000	6500.00	/uploads/1791193408590-Fernhills-Palace,-Ooty_.jpeg	2026-10-05 10:28:55.928142
2	The Tamara Kodai	Premium resort surrounded by the natural beauty of Kodaikanal hills.	10.2381000	77.4892000	9000.00	/uploads/1791193479398-download-(7).jpeg	2026-10-05 10:28:55.938472
1	Sterling Ooty Elk Hill	Comfortable hill resort with beautiful views and a peaceful environment.	11.4102000	76.6950000	6000.00	/uploads/1791193583688-download-(8).jpeg	2026-10-05 10:19:55.333499
\.


--
-- Name: hotels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hotels_id_seq', 16, true);


--
-- PostgreSQL database dump complete
--

\unrestrict CuQEWRK0sqzNDcPFLAilsZ9ru6ybgK7qE3IwS2YntqGq7YBoFqr8owtRUVO69cL

