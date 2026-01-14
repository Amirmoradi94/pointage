"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage your account and application preferences
        </p>
      </div>

      <Card className="dark-card">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription className="text-gray-400">
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
              <Input id="firstName" placeholder="John" className="bg-white/5 border-gray-800 text-white placeholder:text-gray-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
              <Input id="lastName" placeholder="Doe" className="bg-white/5 border-gray-800 text-white placeholder:text-gray-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" disabled className="bg-white/5 border-gray-800 text-gray-500" />
            <p className="text-xs text-gray-500">
              Email address is managed by your authentication provider
            </p>
          </div>
          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="dark-card">
        <CardHeader>
          <CardTitle className="text-white">Grading Preferences</CardTitle>
          <CardDescription className="text-gray-400">
            Configure default grading settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strictness" className="text-gray-300">Default Strictness Level</Label>
            <Select defaultValue="moderate">
              <SelectTrigger className="bg-white/5 border-gray-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="lenient" className="text-white">Lenient</SelectItem>
                <SelectItem value="moderate" className="text-white">Moderate</SelectItem>
                <SelectItem value="strict" className="text-white">Strict</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confidence" className="text-gray-300">Minimum Confidence Threshold</Label>
            <Input
              id="confidence"
              type="number"
              min="0"
              max="100"
              defaultValue="70"
              placeholder="70"
              className="bg-white/5 border-gray-800 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">
              Grades below this confidence level will be flagged for review
            </p>
          </div>

          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">Save Preferences</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="dark-card border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
          <CardDescription className="text-gray-400">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Delete Account</p>
              <p className="text-xs text-gray-500">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
