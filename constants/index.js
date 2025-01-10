import { Database } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { ListTodo } from "lucide-react";
import { Rocket } from "lucide-react";
import { Cog } from "lucide-react";
import { Code } from "lucide-react";
import { Lock } from "lucide-react";
import { ChartLine } from "lucide-react";

export const features = [
    {
        id: 1,
        feature: 'Analytics',
        description: 'Analyze customer behavior and trends.',
        icon: <ChartLine/>
    },
    {
        id: 2,
        feature: 'Security',
        description: 'Protect your business with advanced security features.',
        icon: <Lock/>
    }, 
    {
        id: 3,
        feature: 'Data',
        description: 'Merge and analyze data from multiple sources.',
        icon: <Database/>
    },
    {
        id: 4,
        feature: 'Code',
        description: 'Deploy and manage code efficiently.',
        icon: <Code/>
    },
    {
        id: 5,
        feature: 'Projects',
        description: 'Track project tasks and manage workflows.',
        icon: <CalendarDays/>
    },
    {
        id: 6,
        feature: 'Integrations',
        description: 'Connect multiple apps for seamless data exchange.',
        icon: <Cog/>
    },
    {
        id:7,
        feature: 'Tasks',
        description: 'Manage and automate tasks.',
        icon: <ListTodo/>
    },
    {
        id: 8,
        feature: 'Campaigns',
        description: 'Create and launch marketing campaigns.',
        icon: <Rocket/>
    }
]