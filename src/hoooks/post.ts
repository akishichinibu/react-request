import useRequest, { UseRequestProps } from "./request";

type UsePostProps = Omit<UseRequestProps<null>, "method">;

export function usePost<P=any>(props: UsePostProps) {
  return useRequest<null, P>({
    ...props,
    method: "post",
  });
}
