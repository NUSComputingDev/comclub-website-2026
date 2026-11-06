import React from 'react';
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      orientation={orientation}
      data-orientation={orientation}
      className={cn(
        'group/tabs flex gap-2 data-[orientation=horizontal]:flex-col',
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  [
    'group/tabs-list inline-flex w-fit',
    'items-center justify-center rounded-lg',
    'p-[3px] text-neutral-500 group-data-[orientation=horizontal]/tabs:h-8',
    'group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
    'data-[variant=line]:rounded-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-neutral-100',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot='tabs-list'
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot='tabs-trigger'
      className={cn(
        [
          'relative inline-flex h-[calc(100%-1px)]',
          'flex-1 items-center justify-center',
          'gap-1.5 rounded-md border',
          'border-transparent px-1.5 py-0.5',
          'text-sm font-medium whitespace-nowrap',
          'text-neutral-950/60 transition-all group-data-[orientation=vertical]/tabs:w-full',
          'group-data-[orientation=vertical]/tabs:justify-start hover:text-neutral-950 focus-visible:border-primary',
          'focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:outline',
          'focus-visible:outline-1 focus-visible:outline-primary disabled:pointer-events-none',
          'disabled:opacity-50 has-[[data-icon=inline-end]]:pr-1 has-[[data-icon=inline-start]]:pl-1',
          'aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-neutral-500',
          'dark:hover:text-neutral-950 group-data-[variant=default]/tabs-list:data-[active]:shadow-sm',
          'group-data-[variant=line]/tabs-list:data-[active]:shadow-none',
          '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        ].join(' '),
        [
          'group-data-[variant=line]/tabs-list:bg-transparent',
          'group-data-[variant=line]/tabs-list:data-[active]:bg-transparent',
          'dark:group-data-[variant=line]/tabs-list:data-[active]:border-transparent',
          'dark:group-data-[variant=line]/tabs-list:data-[active]:bg-transparent',
        ].join(' '),
        [
          'data-[active]:bg-white data-[active]:text-neutral-950 dark:data-[active]:border-neutral-200',
          'dark:data-[active]:bg-neutral-200/30 dark:data-[active]:text-neutral-950',
        ].join(' '),
        [
          'after:absolute after:bg-neutral-950 after:opacity-0',
          'after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0',
          'group-data-[orientation=horizontal]/tabs:after:bottom-[-5px]',
          'group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0',
          'group-data-[orientation=vertical]/tabs:after:-right-1',
          'group-data-[orientation=vertical]/tabs:after:w-0.5',
          'group-data-[variant=line]/tabs-list:data-[active]:after:opacity-100',
        ].join(' '),
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot='tabs-content'
      className={cn('flex-1 text-sm outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
