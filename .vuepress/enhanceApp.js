import VueMoment from "vue-moment";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/en-gb";

export default ({ Vue, options, router, siteData }) => {
    Vue.use(VueMoment, {
        moment
    });
};
