import useRequest, { UseRequestProps } from "./request";

type UsePutProps = Omit<UseRequestProps<null>, "method">;

export function usePut<P=any>(props: UsePutProps) {
  return useRequest<null, P>({
    ...props,
    method: "put",
  });
}
