const personalityInfo = t => ({
  big5_openness: {
    color: "rgb(26, 188, 156)",
    leftIntervalText: t("big5_openness.leftIntervalText"),
    rightIntervalText: t("big5_openness.rightIntervalText"),
    description: t("big5_openness.description"),
    title: t("big5_openness.title")
  },
  big5_conscientiousness: {
    color: "rgb(155, 89, 182)",
    leftIntervalText: t("big5_conscientiousness.leftIntervalText"),
    rightIntervalText: t("big5_conscientiousness.rightIntervalText"),
    title: t("big5_conscientiousness.title"),
    description: t("big5_conscientiousness.description")
  },
  big5_extraversion: {
    color: "rgb(52, 152, 219)",
    leftIntervalText: t("big5_extraversion.leftIntervalText"),
    rightIntervalText: t("big5_extraversion.rightIntervalText"),
    title: t("big5_extraversion.title"),
    description: t("big5_extraversion.description")
  },
  big5_agreeableness: {
    color: "rgb(231, 76, 60)",
    leftIntervalText: t("big5_agreeableness.leftIntervalText"),
    rightIntervalText: t("big5_agreeableness.rightIntervalText"),
    description: t("big5_agreeableness.description"),
    title: t("big5_agreeableness.title")
  },
  big5_neuroticism: {
    color: "rgb(241, 196, 15)",
    leftIntervalText: t("big5_neuroticism.leftIntervalText"),
    rightIntervalText: t("big5_neuroticism.rightIntervalText"),
    description: t("big5_neuroticism.description"),
    title: t("big5_neuroticism.title")
  }
});

export default personalityInfo;
