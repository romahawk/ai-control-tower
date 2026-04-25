'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function Settings() {
  const [theme, setTheme] = useState('dark');
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 glass p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Customize your AI Command Center experience.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-accent/10">
            <SettingsIcon className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl">
          {/* Appearance */}
          <Card className="p-6 mb-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6 mb-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Preferences</h2>
            <div className="space-y-4">
              {/* Auto Save */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Auto-save</p>
                  <p className="text-sm text-muted-foreground">Automatically save changes</p>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    autoSave ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      autoSave ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts for important events</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* API Configuration */}
          <Card className="p-6 mb-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">API Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  API Key
                </label>
                <div className="flex gap-2">
                  <Input
                    type={apiKeyVisible ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => setApiKeyVisible(!apiKeyVisible)}>
                    {apiKeyVisible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  API Endpoint
                </label>
                <Input
                  value="https://api.commandcenter.ai/v1"
                  disabled
                />
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border border-destructive/30 bg-destructive/5">
            <h2 className="text-xl font-semibold text-foreground mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <p className="text-xs text-muted-foreground">
                This action will reset all settings to their default values.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer with Save */}
      <div className="border-t border-border bg-card/50 glass p-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {saved ? 'Settings saved!' : 'Changes are automatically saved'}
        </p>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={handleSave}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
