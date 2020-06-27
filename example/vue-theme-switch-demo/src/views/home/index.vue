<template>
  <div class="home">
    <div class="home-top-bar">
      <div class="left">theme-creator-cli Vue Element UI Example</div>
      <div class="right">
        <div class="tool"></div>
        <div class="link-info"></div>
      </div>
    </div>
    <div class="home-content">
      <div class="content-item">
        <div class="content-item-block">
          <span class="icon" />
          <span class="title">Table</span>
        </div>
        <Table />
      </div>
    </div>
  </div>
</template>
<script>
import "./index.scss";
import Table from "./table";
export default {
  components: { Table },
  data() {
    return {};
  }
};
</script>
