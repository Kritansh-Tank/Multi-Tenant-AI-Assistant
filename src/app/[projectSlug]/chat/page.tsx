"use client";

import { useProductInstances } from "@/hooks/useProductInstances";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProjectChatIndex() {
    const params = useParams();
    const projectSlug = params.projectSlug as string;
    const router = useRouter();
    const { data: instances, isLoading } = useProductInstances(projectSlug);

    useEffect(() => {
        if (!isLoading && instances && instances.length > 0) {
            router.replace(`/${projectSlug}/chat/${instances[0]._id}`);
        }
    }, [instances, isLoading, projectSlug, router]);

    return (
        <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
