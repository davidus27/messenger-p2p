<script lang="ts">
    	import { Avatar } from '@skeletonlabs/skeleton-svelte';
        import avatar from 'animal-avatar-generator'
        import DOMPurify from 'dompurify';

const generateAvatar = (avatarId: string) => {
        return DOMPurify.sanitize(avatar(avatarId), {
            USE_PROFILES: { svg: true }
        });
    }

    export let small: boolean = true;
    export let name: string;
</script>


<Avatar 
    name={name} 
    size={small ? "size-12" : "size-14"}
    imageClasses="[filter:url(#Apollo)]"
    >
        {@html generateAvatar(name)}
</Avatar>

<!-- Filter -->
<!-- Ideally you have as single instance of this in your application. -->
<svg id="svg-filter-apollo" class="absolute -left-full w-0 h-0">
  <filter id="Apollo" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feColorMatrix
      values="0.8 0.6 -0.4 0.1 0,
    0 1.2 0.05 0 0,
    0 -1 3 0.02 0,
    0 0 0 50 0"
      result="final"
      in="SourceGraphic"
    ></feColorMatrix>
  </filter>
</svg>
