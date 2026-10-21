export const numericIdsValueProps = {
  getValueProps: (v?: string | string[]) => ({
    value: v == null ? undefined : [v].flat().map(Number),
  }),
};
