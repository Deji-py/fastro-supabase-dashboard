import React, { useMemo } from "react";
import { memo } from "react";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";

import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import useFastroTable from "@/hooks/useFastroTable";
import { ColumnVariantMap } from "@/utils/FastroColumnGenerator";

// Podcast type definition
type Podcast = {
  id: string;
  title?: string;
  avg_rating?: number;
  total_ratings?: number;
  dt_newest_episode_published?: string;
  owner_name?: string;
  owner_email?: string;
  verified_email?: string;
  email_quality?: string;
  mvp_rank?: number;
  audience_size?: number;
  itunes_text_color1?: string;
  itunes_text_color2?: string;
  itunes_text_color3?: string;
  itunes_text_color4?: string;
  artwork_url?: any;
  import_locked?: boolean;
  itunes_id?: number;
  rss_url?: string;
  copyright?: string;
  sentiment?: string;
  ad_cost?: number;
  author_name?: string;
  release_frequency?: string;
  episode_count?: number;
  created_date?: string;
  language?: string;
  genre_names?: string;
  website?: string;
  description?: string;
  trackers?: string;
  host?: string;
  newest_episode_title?: string;
  funding_url?: string;
  is_explicit?: boolean;
  show_type?: string;
  keywords?: string;
  total_audio_seconds?: number;
  avg_episode_duration?: number;
  avg_time_between_episodes_seconds?: number;
  dt_oldest_episode_published?: string;
  show_notes_contain_timestamps?: boolean;
  newest_episode_audio_url?: string;
  retail_host?: string;
  ability_iab?: boolean;
  ability_stats?: boolean;
  ability_tracking?: boolean;
  ability_dynamic_audio?: boolean;
  avg_file_size_bytes?: number;
  total_file_size_bytes?: number;
  itunes_suggested?: string;
  rating_distribution?: string;
  itunes_bg_color?: string;
};

// Template for the form
const podcastTemplate: Partial<Podcast> = {
  id: "",
  title: "",
  avg_rating: 0,
  total_ratings: 0,
  dt_newest_episode_published: "",
  owner_name: "",
  owner_email: "",
  verified_email: "",
  email_quality: "",
  mvp_rank: 0,
  audience_size: 0,
  itunes_text_color1: "",
  itunes_text_color2: "",
  itunes_text_color3: "",
  itunes_text_color4: "",
  artwork_url: "",
  import_locked: false,
  itunes_id: 0,
  rss_url: "",
  copyright: "",
  sentiment: "",
  ad_cost: 0,
  author_name: "",
  release_frequency: "",
  episode_count: 0,
  created_date: "",
  language: "",
  genre_names: "",
  website: "",
  description: "",
  trackers: "",
  host: "",
  newest_episode_title: "",
  funding_url: "",
  is_explicit: false,
  show_type: "",
  keywords: "",
  total_audio_seconds: 0,
  avg_episode_duration: 0,
  avg_time_between_episodes_seconds: 0,
  dt_oldest_episode_published: "",
  show_notes_contain_timestamps: false,
  newest_episode_audio_url: "",
  retail_host: "",
  ability_iab: false,
  ability_stats: false,
  ability_tracking: false,
  ability_dynamic_audio: false,
  avg_file_size_bytes: 0,
  total_file_size_bytes: 0,
  itunes_suggested: "",
  rating_distribution: "",
  itunes_bg_color: "",
};

// Column variant mapping for Input Type
const columnVariants: ColumnVariantMap<Podcast> = {
  avg_rating: "rating",
  ad_cost: "currency",
  owner_email: "email",
  verified_email: "email",
  itunes_bg_color: "color",
  itunes_text_color1: "color",
  itunes_text_color2: "color",
  itunes_text_color3: "color",
  itunes_text_color4: "color",
  artwork_url: "image",
  created_date: "date",
  sentiment: "sentiment",
};

const PodcastsTable = memo(() => {
  console.log("rendred podcasts");
  const {
    data: podcasts,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<Podcast>({
    tableName: "podcasts",
    returning: getColumnsForQuery(podcastTemplate, ["id"]), // Adjust excluded fields if needed
  });

  // ✅ Memoize the podcasts data if any transformation is done

  return (
    <Container size="xl" fluid py="sm">
      <FastroTable
        data={podcasts}
        columnVariants={columnVariants}
        enableCreate
        enableEdit
        enableDelete
        enableRowSelection
        loading={isLoading}
        onRowCreate={handleCreateRow}
        onRowUpdate={handleUpdateRow}
        onRowDelete={handleDeleteRow}
        onBulkDelete={handleBulkDelete}
        editableColumns={["title", "owner_name", "ad_cost"]}
        dropdownOptions={[
          {
            field: "language",
            options: [
              { value: "en", label: "English" },
              { value: "es", label: "Spanish" },
              { value: "fr", label: "French" },
            ],
          },
          {
            field: "release_frequency",
            options: [
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
            ],
          },
        ]}
        createTemplate={podcastTemplate}
      />
    </Container>
  );
});

export default PodcastsTable;
