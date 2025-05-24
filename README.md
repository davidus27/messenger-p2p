# Hybrid Secure Messenger

This project aims to develop a minimalistic, secure, and user-friendly hybrid messenger implemented as a static single-page application (SPA) using SvelteKit. Users will have the flexibility to select their preferred communication mode:
* Peer-to-Peer (P2P) using WebRTC: Fast, decentralized, serverless, but with direct IP exposure.
* Centralized Relay: Secure, privacy-oriented messaging routed via a minimal and highly scalable relay server.
Core Features:
* End-to-End Encryption (E2EE): Messages and files encrypted using post-quantum cryptography (hybrid scheme: Kyber768 + X25519 with XChaCha20-Poly1305).
* Security Practices: Minimal DOM manipulation to prevent XSS, strict HTTP security headers, HTTPS enforced.
* Ephemeral Storage: All user data (messages/files) stored exclusively in RAM; only peer IDs stored in browser localStorage for reconnection. Includes "wipe" button for instant data purge.
Relay Server:
* Custom, stateless, encrypted Pub-Sub relay with no logging, message storage only temporary until delivery.
* Includes options for load balancing, easy Docker/Kubernetes deployment.
* May optionally bundle STUN/TURN server functionalities to support NAT traversal and enhance privacy.
* Default free-tier relay provided; custom server configuration supported.
User Experience & Design:
* Modern, minimalist UI; intuitive and stylish interface optimized for ease of use.
* Minimal JavaScript and only essential dependencies.
* Clear options for user to configure STUN/TURN servers or custom relay backends.
Communication Initialization:
* Simple, secure peer ID sharing mechanism to initiate communications privately and safely.
The end product will provide users a flexible, privacy-focused messaging solution, easily deployable, scalable, secure by default, and optimized for minimal digital footprints.
