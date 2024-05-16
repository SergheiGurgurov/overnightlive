<script>
  import { fly } from "svelte/transition";

  export let image = "";
  export let score = 0;
</script>

<div in:fly={{ y: 50, duration: 2000 }} class="card">
  <span class="score">{score}</span>
  <img src={image} alt="none" />
</div>

<style>
  .card {
    font-size: 90px;
    float: right;
    padding: 0.2em;
    padding-left: 0.3em;
    border: 0.02em solid #0002;
    border-right: none;
    border-radius: 0.2em;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    display: flex;
    align-items: center;
    gap: 0.3em;

    background-color: #e7e7e7;
  }

  .score {
    font-family: sans-serif;
    font-weight: 700;
    font-size: 1em;
    line-height: 1em;
  }

  img {
    height: 1em;
  }

  :global(body) {
    margin: 0;
  }
</style>
