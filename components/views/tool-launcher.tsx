'use client';

import React, { useState } from 'react';
import { Zap, Download, Play, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TOOLS } from '@/lib/mock-data';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: 'available' | 'beta' | 'deprecated';
  usage: number;
}

export function ToolLauncher() {
  const [tools, setTools] = useState<Tool[]>(TOOLS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

  const categories = ['all', ...new Set(tools.map(t => t.category))];

  const handleLaunchTool = (toolId: string) => {
    setRecentlyUsed(prev => [
      toolId,
      ...prev.filter(id => id !== toolId)
    ].slice(0, 5));
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                          tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recent = tools.filter(t => recentlyUsed.includes(t.id));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tool Launcher</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Access and manage all your AI tools and integrations in one place.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-accent/10">
            <Zap className="w-6 h-6 text-accent" />
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4"
        />

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Recently Used */}
        {recent.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recently Used</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {recent.map(tool => (
                <Card
                  key={tool.id}
                  className="p-4 border border-border/50 hover:border-primary/50 bg-surface hover:bg-surface-raised transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent">
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{tool.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                          {tool.category}
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          tool.status === 'available' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                          tool.status === 'beta' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                          'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                        }`}>
                          {tool.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleLaunchTool(tool.id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Launch
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Tools */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            All Tools {filteredTools.length > 0 && `(${filteredTools.length})`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => (
              <Card
                key={tool.id}
                className="p-4 border border-border hover:border-primary/50 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{tool.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                        {tool.category}
                      </span>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        tool.status === 'available' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                        tool.status === 'beta' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                        'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                      }`}>
                        {tool.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {tool.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleLaunchTool(tool.id)}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Launch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
