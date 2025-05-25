<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import avatar from 'animal-avatar-generator';
	import DOMPurify from 'dompurify';

	const generateAvatar = (avatarId: string): string => {
		const svgContent = avatar(avatarId, { blackout: true }); // SVG string from library
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgContent, 'image/svg+xml');

		const svgEl = doc.documentElement;
		if (creepyMode && svgEl.tagName === 'svg') {
			svgEl.setAttribute('filter', 'url(#Apollo)');
		}

		// Serialize back to string
		const serialized = new XMLSerializer().serializeToString(doc);

		// Sanitize the final SVG output
		return DOMPurify.sanitize(serialized, {
			USE_PROFILES: { svg: true }
		});
	};

  export let creepyMode: boolean = false; // secret mode
	export let small: boolean = true;
	export let name: string;
</script>

<Avatar {name} size={small ? 'size-12' : 'size-14'}>
	{@html generateAvatar(name)}
</Avatar>


<svg id="svg-filter-apollo" class="absolute -left-full h-0 w-0">
  <filter 
    id="Apollo"
    filterUnits="objectBoundingBox"
    primitiveUnits="userSpaceOnUse"
    color-interpolation-filters="sRGB"
  >

    <!-- Step 1: Boost contrast -->
    <feComponentTransfer result="highContrast">
      <feFuncR type="linear" slope="1.8" intercept="-0.2" />
      <feFuncG type="linear" slope="1.8" intercept="-0.2" />
      <feFuncB type="linear" slope="1.8" intercept="-0.2" />
    </feComponentTransfer>

    <!-- Step 2: Generate strong vertical turbulence -->
    <feTurbulence 
      in="blur"
      type="turbulence" 
      baseFrequency="0.05 0.15" 
      numOctaves="10" 
      seed="42" 
      result="turbulence" />

    <!-- Step 3: Displace image using vertical noise -->
    <feDisplacementMap 
      in="highContrast" 
      in2="turbulence" 
      scale="50" 
      xChannelSelector="A" 
      yChannelSelector="G" 
      result="distorted" />

    <!-- Step 4: Optional slight blur to smear distortion -->
    <feGaussianBlur in="distorted" stdDeviation="0.01" result="blurred" />

    <!-- Step 5: Blend with original to retain shape -->
    <feBlend in="SourceGraphic" in2="blurred" mode="darken" result="final" />
  </filter>
</svg>
