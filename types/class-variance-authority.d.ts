declare module "class-variance-authority" {
  export type VariantProps<Component extends (...args: any) => any> = Record<string, unknown>;

  export function cva<Schema>(
    base?: string,
    config?: {
      variants?: Schema;
      defaultVariants?: Record<string, unknown>;
      compoundVariants?: unknown[];
    }
  ): (props?: Record<string, unknown> & { class?: string; className?: string }) => string;
}
