'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, FileText, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CONTEXTS } from '@/lib/mock-data';
import { Context } from '@/types/navigation';

export function ContextManager() {
  const [contexts, setContexts] = useState<Context[]>(CONTEXTS);
  const [filter, setFilter] = useState('all');
  const [newContextName, setNewContextName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddContext = () => {
    if (newContextName.trim()) {
      const newContext: Context = {
        id: `ctx-${Date.now()}`,
        name: newContextName,
        description: 'New context',
        itemCount: 0,
        lastModified: new Date().toLocaleDateString(),
        type: 'custom',
      };
      setContexts([newContext, ...contexts]);
      setNewContextName('');
    }
  };

  const handleDeleteContext = (id: string) => {
    setContexts(contexts.filter(c => c.id !== id));
  };

  const handleCopyContext = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredContexts = filter === 'all' 
    ? contexts 
    : contexts.filter(c => c.type === filter);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Context Manager</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organize and manage your knowledge bases, documents, and context files.
            </p>
          </div>
        </div>

        {/* Add Context */}
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="New context name..."
            value={newContextName}
            onChange={(e) => setNewContextName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddContext()}
            className="flex-1"
          />
          <Button
            onClick={handleAddContext}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Context
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          {['all', 'document', 'custom', 'api'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {filteredContexts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-semibold text-foreground">No contexts yet</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Add your first context to get started organizing your knowledge base.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContexts.map(context => (
              <Card
                key={context.id}
                className="p-4 border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {context.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {context.description}
                      </p>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground whitespace-nowrap ml-2">
                    {context.type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{context.itemCount} items</span>
                  <span>{context.lastModified}</span>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-8"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-8"
                    onClick={() => handleCopyContext(context.id)}
                  >
                    {copiedId === context.id ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => handleDeleteContext(context.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
