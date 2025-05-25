<script lang="ts">
    import type { Person } from './types';

    export let people: Person[] = [];
	export let currentPersonId: number;

    const getCurrentPerson = (): string => {
		if (currentPersonId === undefined) {
			return 'Unknown';
		}
		return people.find((person) => person.id === currentPersonId)?.name ?? 'Unknown';
	};
</script>

<div class="border-surface-200-800 border-b-[1px] p-5">
    <p class="font-bold">Chat with {getCurrentPerson()}</p>
</div>