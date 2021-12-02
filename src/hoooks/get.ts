import useRequest, { UseRequestProps } from "./request";

type UseGetProps = Omit<UseRequestProps<null>, "method">;

export function useGet<P=any>(props: UseGetProps) {
  return useRequest<null, P>({
    ...props,
    method: "get",
  });
}
