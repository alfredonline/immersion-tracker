"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar, Clock, Loader2, X, Edit2, Archive } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ActivityType } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { formatMinutes } from "@/lib/time";
import EditSessionDialog from "../edit-session-dialog";
import { StudySessionWithLanguage } from "@/lib/schemas/study-session";
import {
  getStudySessions,
  toggleSessionArchive,
} from "@/app/actions/study-sessions";

interface Filters {
  language?: string;
  activity?: ActivityType;
}

const ITEMS_PER_PAGE = 10;

interface StudyHistoryTableProps {
  initialData: {
    sessions: StudySessionWithLanguage[];
    pagination: {
      total: number;
      pages: number;
      current: number;
    };
  };
}

const StudyHistoryTable = ({ initialData }: StudyHistoryTableProps) => {
  const { toast } = useToast();
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState(initialData.sessions);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({});
  const [languages, setLanguages] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const router = useRouter();

  const totalPages = Math.ceil(
    (data?.length && data?.length / ITEMS_PER_PAGE) || 1
  );

  useEffect(() => {
    const uniqueLanguages = Array.from(
      new Map(
        initialData.sessions.map((s) => [s.language.id, s.language])
      ).values()
    );
    setLanguages(uniqueLanguages);
  }, [initialData]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getStudySessions(page, ITEMS_PER_PAGE, {
        ...filters,
      });
      setData(result.sessions);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch study sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, toast]);

  const handleFilterChange = (key: keyof Filters, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const clearFilters = () => {
    setFilters({});
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={filters.language}
          onValueChange={(value) => handleFilterChange("language", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All languages" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language.id} value={language.id}>
                {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.activity}
          onValueChange={(value) =>
            handleFilterChange("activity", value as ActivityType)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All activities" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ActivityType).map((type) => (
              <SelectItem key={type} value={type}>
                {type
                  .split("_")
                  .map((word) => word?.charAt(0) + word?.slice(1)?.toLowerCase())
                  .join(" ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No study Sessions Found
                </TableCell>
              </TableRow>
            ) : (
              data?.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(session.date), "PPP")}
                    </div>
                  </TableCell>
                  <TableCell>{session.language.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatMinutes(session.duration)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {session.type
                      .split("_")
                      .map(
                        (word) => word.charAt(0) + word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </TableCell>
                  <TableCell>
                    {session.difficulty && (
                      <Badge variant="outline">
                        {session.difficulty
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0) + word.slice(1).toLowerCase()
                          )
                          .join(" ")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditSessionDialog
                        session={session as StudySessionWithLanguage}
                        languages={languages}
                        trigger={
                          <Button variant={"ghost"} size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        }
                        onSuccess={() => router.refresh()}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Archive className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Archive study session
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to archive this study
                              session? You can view and restore archived
                              sessions.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                const result = await toggleSessionArchive(
                                  session.id
                                );
                                if (result.error) {
                                  toast({
                                    title: "Error",
                                    description: result.error,
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                toast({
                                  title: "Success",
                                  description: "Session archived successfully",
                                  variant: "default",
                                });

                                router.refresh();
                              }}
                            >
                              Archive
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  className="w-32"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <PaginationPrevious />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="px-4">
                  Page {page} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  className="w-32"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <PaginationNext />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default StudyHistoryTable;
