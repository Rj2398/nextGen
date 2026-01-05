import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  Alert,
  Linking,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";

// --- Icon Imports ---
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import PinPostModal from "../../components/PinPostModal";
import AudienceModal from "../../components/AudienceModal";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import userPost from "../../../hooks/userPost";
import Loader from "../../components/Loader";
import PaginationBar from "../../components/PaginationBar";
import { Like, Comment, PostView } from "../../../assets/startUpImg";
import SortDropdown from "../../components/SortDropdown";
import { useCan } from "../../../casl/useCan";
import { useDebounce } from "../../../hooks/useDebounce";

import Video from "react-native-video";
import CommentSection from "../../components/user/CommentSection";
import FullHeart from "../../components/FullHeart";
import CommentBottomSheet from "../../components/user/CommentBottomSheet";

// --- Color Palette and Constants ---
const PRIMARY_ORANGE = "#F97316";
const DARK_GRAY_TEXT = "#1F2937";
const MEDIUM_GRAY_TEXT = "#4B5563";
const LIGHT_GRAY_TEXT = "#6B7280";
const BORDER_COLOR = "#D1D5DB";
const INPUT_BORDER = "#D1D5DB";
const WHITE = "#FFFFFF";
const LIGHT_BG = "#F9FAFB";
const CHIP_BG_ACTIVE = "#FF7A00";
const TAG_BG = "#F0F9FF";
const MEDIA_UPLOAD_BG = "#F3F4F6";
const textLightGrey = "#A0A0A0";

const { width } = Dimensions.get("window");

// --------------------------------------------------------------------------------
// 1. PostCard Component
// --------------------------------------------------------------------------------

const PostCard = ({
  postid,
  post,
  setPinPostModalVisibleon,
  onEdit,
  onDelete,
  canDelete,
  canUpdate,
}) => {
  // console.log("sdfsdfsdfsdfsdfsdf",postid)
  const ActionMenu = ({ postId, onEdit, onDelete, canDelete, canUpdate }) => (
    <View style={styles.actionMenu}>
               
      {canUpdate && (
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => onEdit(postId)} //setIsMenuVisible(false)}
        >
                          <Text style={styles.menuText}>Edit</Text>         
        </TouchableOpacity>
      )}
                 {" "}
      {canUpdate && canDelete && <View style={styles.menuDivider} />}  
      {canDelete && (
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => onDelete(postId)} //setIsMenuVisible(false)}
        >
                          <Text style={styles.menuText}>Delete</Text>         
        </TouchableOpacity>
      )}
           
    </View>
  );

  const ExpandableText = ({ text, maxWords = 20 }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) return null;

    const words = text.split(" ");
    const shouldTruncate = words.length > maxWords;

    const displayText = expanded ? text : words.slice(0, maxWords).join(" ");

    return (
      <Text style={styles.postContent}>
        {displayText}
        {shouldTruncate && (
          <Text
            style={styles.seeMoreText}
            onPress={() => setExpanded(!expanded)}
          >
            {expanded ? "  See less" : "  See more"}
          </Text>
        )}
      </Text>
    );
  };

  const renderCommentBottomSheet = () => {
    if (!showComments) return null;
    return (
      <Modal
        visible={showComments}
        transparent
        animationType="slide"
        onRequestClose={closeComments}
      >
        {/* Background */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeComments}
        />

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          <View style={styles.dragBar} />

          <CommentSection
            comments={[
              { user: "Rahul", text: "Nice post 👍" },
              { user: "Amit", text: "Very helpful" },
              { user: "Neha", text: "Great 👏" },
            ]}
            onSubmit={(text) => {
              console.log("NEW COMMENT:", text);
              closeComments();
            }}
          />
        </View>
      </Modal>
    );
  };

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mediaList =
    post?.upload_media && post.upload_media.length > 0 ? post.upload_media : [];

  console.log("********", mediaList);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const closeComments = () => setShowComments(false);
  const openComments = () => setShowComments(true);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.authorInfo}>
          <Image
            source={{
              uri: post.author_avatar
                ? post.author_avatar
                : "https://randomuser.me/api/portraits/men/3.jpg",
            }}
            style={styles.avatar}
          />
          <View>
            <View style={styles.statusAndTime}>
              <Text style={styles.authorName}>
                {" "}
                {post?.post_title || "Title"}
              </Text>
              <Text style={styles.postTime}>{post.time_ago}</Text>
            </View>

            <View style={styles.tagsContainer}>
              <View style={styles.statusChip}>
                <Text style={styles.postStatus}>
                  {post.status_chips || "Public"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {(canUpdate || canDelete) && (
          <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)}>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={LIGHT_GRAY_TEXT}
            />
          </TouchableOpacity>
        )}
        {/* Render Menu only if visible */}             
        {isMenuVisible && (
          <ActionMenu
            postId={postid}
            canDelete={canDelete}
            canUpdate={canUpdate}
            onEdit={(id) => {
              setIsMenuVisible(false);
              onEdit(id);
            }}
            onDelete={async (id) => {
              setIsMenuVisible(false);
              onDelete(id);
            }}
          />
        )}
      </View>

      <ExpandableText text={post.post_content} />
      {mediaList?.length > 0 && (
        <FlatList
          data={mediaList}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            // ❌ PDF → kuch bhi render nahi karna
            if (item?.file_type === "pdf") {
              //  return null;
              return (
                <TouchableOpacity onPress={() => Linking.openURL(item?.url)}>
                  <Image
                    source={require("../../../assets/startUpImg/png/pdf_ic.png")}
                    style={[styles.postImage, { alignSelf: "center" }]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            }

            // 🖼 IMAGE → normal image show
            if (item?.file_type === "image") {
              return (
                <Image
                  source={{ uri: item?.url }}
                  style={[styles.postImage, { alignSelf: "center" }]}
                  resizeMode="cover"
                />
              );
            }
            // 🎥 VIDEO → thumbnail show
            // if (item?.file_type === "video") {
            //   return (
            //     <Image
            //       source={{
            //         uri: item?.thumbnail_url
            //           ? item.thumbnail_url
            //           : "https://picsum.photos/301/200",
            //         cache: "force-cache",
            //       }}
            //       style={[styles.postImage, { alignSelf: "center" }]}
            //       resizeMode="cover"
            //     />
            //   );
            // }
            //             if (item?.file_type === "video") {
            //   return (
            //     <View style={{ position: "relative", alignSelf: "center" }}>
            //       {/* Thumbnail Image */}
            //       <Image
            //         source={{
            //           uri: item?.thumbnail_url
            //             ? item.thumbnail_url
            //             : "https://picsum.photos/301/200",
            //           cache: "force-cache",
            //         }}
            //         style={[styles.postImage, { alignSelf: "center" }]}
            //         resizeMode="cover"
            //       />

            //       {/* Overlay Buttons */}
            //       <View
            //         style={{
            //           position: "absolute",
            //           top: 0,
            //           left: 0,
            //           right: 0,
            //           bottom: 0,
            //           justifyContent: "center",
            //           alignItems: "center",
            //         }}
            //       >
            //         {/* Play Button */}
            //         <TouchableOpacity
            //           style={{
            //             width: 50,
            //             height: 50,
            //             borderRadius: 25,
            //             backgroundColor: "rgba(0,0,0,0.5)",
            //             justifyContent: "center",
            //             alignItems: "center",
            //             marginBottom: 10,
            //           }}
            //           onPress={() => {
            //             console.log("Play Video:", item?.file_url);

            //           }}
            //         >
            //           <Text style={{ color: "white", fontSize: 24 }}>▶</Text>
            //         </TouchableOpacity>
            //       </View>
            //     </View>
            //   );
            // }

            if (item?.file_type === "video") {
              return (
                <View style={{ position: "relative", alignSelf: "center" }}>
                  {!isPlaying ? (
                    <>
                      {/* Thumbnail */}
                      <Image
                        source={{
                          uri: item?.thumbnail_url
                            ? item.thumbnail_url
                            : "https://picsum.photos/301/200",
                        }}
                        style={styles.postImage}
                        resizeMode="cover"
                      />

                      {/* Play Button */}
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() => setIsPlaying(true)}
                        >
                          <Text style={{ color: "white", fontSize: 26 }}>
                            ▶
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    /* Video Player */
                    <Video
                      source={{ uri: item?.url }}
                      style={styles.postImage}
                      resizeMode="cover"
                      controls={true}
                      paused={false}
                      onEnd={() => setIsPlaying(false)}
                      onError={(e) => console.log("Video Error", e)}
                    />
                  )}
                </View>
              );
            }

            return null;
          }}
        />
      )}

      <View style={styles.indicatorContainer}>
        {mediaList.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      <View style={styles.tagsContainer}>
        {(post?.post_audience || []).map((tag, index) => (
          <View key={index} style={styles.tagChip}>
            <Text style={styles.tagText}>{tag.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          onPress={() => setIsLiked(!isLiked)}
          style={styles.engagementMetric}
        >
          {/* <Like width={18} height={18} fill={LIGHT_GRAY_TEXT} /> */}
          <FullHeart width={18} height={18} liked={isLiked} />
          <Text style={styles.metricText}>{post.likes_count} Views</Text>
        </TouchableOpacity>
        <View style={styles.engagementMetric}>
          {/* <MaterialCommunityIcons
            name="eye"
            size={18}
            color={LIGHT_GRAY_TEXT}
          /> */}
          <PostView width={18} height={18} fill={LIGHT_GRAY_TEXT} />
          <Text style={styles.metricText}>{post.views_count} Views</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            openComments();
          }}
          activeOpacity={0.7}
          style={styles.engagementMetric}
        >
          <Comment width={18} height={18} fill={LIGHT_GRAY_TEXT} />
          <Text style={styles.metricText}>{post.comments_count} Comments</Text>
        </TouchableOpacity>
        {/* {renderCommentBottomSheet()} */}
        <CommentBottomSheet
          visible={showComments}
          onClose={() => closeComments()}
          comments={[
            { user: "Rahul", text: "Nice post 👍" },
            { user: "Amit", text: "Very helpful" },
            { user: "Neha", text: "Great 👏" },
          ]}
          onSubmit={(text) => {
            closeComments();
            console.log("NEW COMMENT:", text);
          }}
        />
      </View>
    </View>
  );
};

const MyPost = () => {
  const [pinPostModalVisible, setPinPostModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  // const [combinedPosts, setCombinedPosts] = useState([]);
  const {
    isLoadingupdate,
    postsListQuery,
    deletePost,
    postsSearchQuery,
    page,
    pageSize,
    setPage,
    setPageSize,
    status,
    setStatus,
    SortOrder,
    setSortby,
  } = userPost({ SearchTerm: debouncedSearchTerm });
  //  const activeQuery =searchTerm.length > 0 ? postsSearchQuery: (status && status !== "")?
  //  postsStatusQuery : postsListQuery;
  const activeQuery =
    debouncedSearchTerm.length > 0 ? postsSearchQuery : postsListQuery;
  const { data, isError, error, isLoading } = activeQuery;
  const postList = Array.isArray(data?.items) ? data?.items : [];
  console.log("Api Data *******", postList);
  const { width } = Dimensions.get("window");
  //const pages = data?.pagination?.page
  const [currentPage, setCurrentPage] = useState(
    data?.pagination?.page || page
  );
  const totalPages = data?.pagination?.totalPages || pageSize;
  const navigation = useNavigation();

  const [sortBy, setSort] = useState(SortOrder);

  const canCreate = useCan("create", "AcademiaPost");
  const canDelete = useCan("delete", "AcademiaPost");
  const canUpdate = useCan("update", "AcademiaPost");
  const canRead = useCan("read", "AcademiaPost");
  const canRealAll = useCan("readall", "AcademiaPost");

  // ------------------------------------------------------------------------
  // 🌟 Conditional Rendering Logic for My Post Screen
  // ------------------------------------------------------------------------

  useEffect(() => {
    setCurrentPage(page); // hook page update hone par local state update
  }, [page]);
  // Show alert on error
  useEffect(() => {
    if (isError) {
      Alert.alert("Error", error?.message || "Something went wrong", [
        { text: "OK" },
      ]);
    }
  }, [isError, error]);

  // useEffect(() => {
  //   if (data?.items) {
  //     setCombinedPosts(prev => {
  //       // Avoid duplicate items if any
  //       const newItems = data.items.filter(
  //         item => !prev.some(p => p.id === item.id)
  //       );
  //       return [...prev, ...newItems];
  //     });
  //   }
  // }, [data]);

  const handlePrev = () => {
    if (page > 1) {
      //setCurrentPage(prev => prev - 1);
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      //setCurrentPage(prev => prev + 1);
      setPage((prev) => prev + 1);
    }
  };

  const renderMyPostContent = () => {
    if (!canRealAll) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            {"You do not have permission to view posts"}
          </Text>
        </View>
      );
    }

    if (!postList || postList.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          {renderSearchAndFilter([])}
          <Text style={styles.noDataText}>No data found</Text>
        </View>
      );
    }
    return (
      <ScrollView contentContainerStyle={styles.listScrollViewContent}>
        {renderSearchAndFilter(postList)}
        <SortDropdown
          value={sortBy}
          onChange={(value) => {
            setSortby(value);
            setSort(value);
          }}
        />
        {/* Posts List */}
        <View style={styles.postsList}>
          {postList.map((post) => (
            <PostCard
              key={post.id}
              postid={post.id}
              canDelete={canDelete}
              canUpdate={canUpdate}
              post={post?.Posts_List?.PostList}
              setPinPostModalVisible={setPinPostModalVisible}
              onEdit={(id) => {
                navigation.navigate("EditPost", {
                  postId: id,
                  postData: post,
                });
                console.log("Edit post with ID:", post);
                // navigate to edit screen or open edit modal
              }}
              onDelete={async (id) => {
                console.log("Delete post with ID:", id);
                try {
                  const response = await deletePost(id); // from your hook
                  // 2. Check for success message in response
                  // Most APIs return a "message" or "status" field
                  const successMsg =
                    response?.message || "Post deleted successfully!";

                  console.log("API Response:", response);

                  // 3. Show success message to the user
                  Alert.alert("Success", successMsg);
                } catch (error) {
                  console.error("Error deleting post:", error.message);
                  Alert.alert("Error", error.message);
                }
              }}
            />
          ))}
        </View>
        {/* PaginationBar call */}
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </ScrollView>
    );
  };

  const renderSearchAndFilter = (posts) => {
    const statusFilters = posts?.[0]?.Posts_List?.StatusFilters || {};

    // Filters with keys and API labels
    const filters = [
      { key: "filter_all", label: statusFilters.filter_all || "All (0)" },
      {
        key: "filter_published",
        label: statusFilters.filter_published || "Published (0)",
      },
      {
        key: "filter_archived",
        label: statusFilters.filter_archived || "Archived (0)",
      },
      {
        key: "filter_pinned",
        label: statusFilters.filter_pinned || "Pinned (0)",
      },
    ];

    // Active filter state (key-based)
    const [activeFilterKey, setActiveFilterKey] = useState("filter_all");

    // Handle chip click
    const handleFilterPress = async (filterKey) => {
      // Update active filter
      setActiveFilterKey(filterKey);

      // Trigger API based on filterKey
      switch (filterKey) {
        case "filter_all":
          console.log("Selected Filter: All");
          setStatus("all");
          break;
        case "filter_published":
          console.log("Selected Filter: Published");
          setStatus("published");
          break;
        case "filter_archived":
          console.log("Selected Filter: Archived");
          setStatus("archived");
          break;
        case "filter_pinned":
          console.log("Selected Filter: Pinned");
          setStatus("pinned");
          break;
        default:
          console.log("Selected Filter: Unknown");
        //  setStatus("all");
      }
    };

    return (
      <>
        {/* Search */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchInputWrapper}>
            <FontAwesome
              name="search"
              size={16}
              color={LIGHT_GRAY_TEXT}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search title, text, audience..."
              placeholderTextColor={LIGHT_GRAY_TEXT}
              value={searchTerm}
              onChangeText={(text) => setSearchTerm(text)} // API trigger
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScrollView}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.chip,
                activeFilterKey === filter.key && styles.activeChip,
              ]}
              onPress={() => handleFilterPress(filter.key)} // ✅ Call function on click
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilterKey === filter.key && styles.activeChipText,
                ]}
              >
                {filter.label} {/* API label */}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Loader visible={isLoading || isLoadingupdate} />

      {/* 1. TOP HEADER */}
      {/* <Header title="My Posts" onBackPress={() => navigation.goBack()} /> */}

      {renderMyPostContent()}
      {/* FAB is only shown when not in Error state */}
      {canCreate && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("CreatePost")}
        >
          <MaterialCommunityIcons name="plus" size={28} color={WHITE} />
        </TouchableOpacity>
      )}

      <PinPostModal
        isVisible={pinPostModalVisible}
        onClose={() => setPinPostModalVisible(false)}
      />
    </View>
  );
};

export default MyPost;

// --------------------------------------------------------------------------------
// 4. Stylesheets
// --------------------------------------------------------------------------------

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: LIGHT_BG },
  // --- Top Header Bar & Toggle ---
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: WHITE,
    borderBottomColor: BORDER_COLOR,
    borderBottomWidth: 1,
  },
  logo: { width: 30, height: 30, resizeMode: "contain" },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: DARK_GRAY_TEXT,
    flex: 1,
    textAlign: "center",
    marginLeft: 10,
  },
  menuIcon: { padding: 5 },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    padding: 3,
    borderRadius: 8,
    marginHorizontal: 15,
    marginVertical: 10,
    borderBottomWidth: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 0,
  },
  activeTab: { backgroundColor: PRIMARY_ORANGE },
  tabButtonText: { fontSize: 15, fontWeight: "600", color: DARK_GRAY_TEXT },
  activeTabButtonText: { color: WHITE },

  // --- ScrollView Content Styles ---
  listScrollViewContent: { padding: 15, paddingBottom: 80 },
  createScrollViewContent: { padding: 20, paddingBottom: 100 },

  // --- Post Card Styles ---
  card: {
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  authorInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  authorName: {
    fontSize: 15,
    fontWeight: "600",
    color: DARK_GRAY_TEXT,
  },
  statusAndTime: {
    flexDirection: "row",
    marginTop: 2,
    alignItems: "flex-start",
  },
  postTime: { fontSize: 14, color: LIGHT_GRAY_TEXT, marginStart: 10 },
  postStatus: {
    fontSize: 14,
    color: LIGHT_GRAY_TEXT,
    marginLeft: 3,
    alignSelf: "center",
    color: "#43A3A3",
  },
  tagChip: {
    backgroundColor: "#FFB76633",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: DARK_GRAY_TEXT,
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    // width: width - 32,
    // height: width * 0.5,
    width: width - 60,
    height: width * 0.5,
    alignSelf: "center",
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 10,
    marginRight: 0,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    marginTop: 10,
  },
  statusChip: {
    backgroundColor: TAG_BG,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 12, color: "#3D3A3A", fontWeight: "500" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
    flexWrap: "wrap", // 👈 VERY IMPORTANT
  },
  engagementMetric: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  metricText: { fontSize: 14, color: LIGHT_GRAY_TEXT, marginLeft: 5 },
  loadMoreButton: {
    backgroundColor: LIGHT_BG,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 0,
  },
  loadMoreButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: DARK_GRAY_TEXT,
  },

  // --- Search and Filter (My Post View) ---
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 0,
  }, // Removed redundant padding
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    height: 45,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: DARK_GRAY_TEXT, height: "100%" },
  filterButton: {
    backgroundColor: WHITE,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  chipsScrollView: { marginBottom: 20, paddingVertical: 5 },
  chip: {
    backgroundColor: MEDIA_UPLOAD_BG,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: MEDIA_UPLOAD_BG,
  },
  activeChip: { backgroundColor: CHIP_BG_ACTIVE, borderColor: WHITE },
  chipText: { fontSize: 13, color: MEDIUM_GRAY_TEXT, fontWeight: "500" },
  activeChipText: { color: WHITE, fontWeight: "600" },

  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: PRIMARY_ORANGE,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },

  // 🌟 Error/Empty Status Styles
  statusContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 50,
    alignItems: "center",
  },
  emptyContainer: { paddingTop: 80 },
  errorBox: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: DARK_GRAY_TEXT,
    marginBottom: 5,
  },
  errorSubtitle: {
    fontSize: 14,
    color: MEDIUM_GRAY_TEXT,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  tryAgainButton: {
    backgroundColor: PRIMARY_ORANGE,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    marginBottom: 15,
    height: 50,
    justifyContent: "center",
  },
  tryAgainButtonText: { color: WHITE, fontSize: 16, fontWeight: "600" },
  viewCachedText: { color: PRIMARY_ORANGE, fontSize: 14, fontWeight: "600" },
  createPostButton: {
    backgroundColor: PRIMARY_ORANGE,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    marginTop: 20,
  },
  createPostButtonText: { color: WHITE, fontSize: 16, fontWeight: "600" },
  connectionStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: WHITE,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  troubleshooting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: WHITE,
    padding: 15,
  },
  statusText: { fontSize: 14, fontWeight: "600", color: DARK_GRAY_TEXT },
  onlineIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  onlineText: { fontSize: 14, color: MEDIUM_GRAY_TEXT },

  // --- Create Post Form Styles (Kept as before) ---
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK_GRAY_TEXT,
    marginBottom: 8,
    marginTop: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: DARK_GRAY_TEXT,
    backgroundColor: WHITE,
  },
  dropdownInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  audienceText: { flex: 1, fontSize: 14, color: DARK_GRAY_TEXT, padding: 0 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  audienceChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  mediaUploadBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    borderWidth: 2,
    borderColor: INPUT_BORDER,
    borderStyle: "dashed",
    borderRadius: 8,
    backgroundColor: MEDIA_UPLOAD_BG,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK_GRAY_TEXT,
    marginTop: 10,
  },
  uploadInfo: { fontSize: 12, color: LIGHT_GRAY_TEXT, marginTop: 5 },
  filesContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  filePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 12,
    color: DARK_GRAY_TEXT,
    marginRight: 8,
    maxWidth: width * 0.35,
  },
  descriptionInput: {
    minHeight: 150,
    textAlignVertical: "top",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingVertical: 15,
  },
  descriptionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  requiredText: { fontSize: 12, color: PRIMARY_ORANGE, fontWeight: "500" },
  charCount: { fontSize: 12, color: LIGHT_GRAY_TEXT },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: INPUT_BORDER,
  },
  switchTitle: { fontSize: 14, fontWeight: "600", color: DARK_GRAY_TEXT },
  switchSubtitle: { fontSize: 12, color: MEDIUM_GRAY_TEXT, marginTop: 2 },
  buttonContainerFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: INPUT_BORDER,
    backgroundColor: WHITE,
    zIndex: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
  },
  cancelButtonText: { color: DARK_GRAY_TEXT, fontSize: 16, fontWeight: "600" },
  publishButton: { backgroundColor: PRIMARY_ORANGE },
  publishButtonText: { color: WHITE, fontSize: 16, fontWeight: "600" },
  // --- Deal Card Menu Styles ---
  actionMenu: {
    position: "absolute",
    top: 35,
    right: 15,
    zIndex: 10,
    width: 150,
    backgroundColor: WHITE,
    borderRadius: 8,
    paddingVertical: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 14,
    color: "#3D3A3A",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#FF7A00",
    width: 7,
  },
  seeMoreText: {
    color: "#FF7A00",
    fontWeight: "500",
  },
  noDataContainer: {
    alignItems: "center",
    padding: 15,
    paddingBottom: 80,
  },
  noDataText: {
    color: textLightGrey,
    fontSize: 14,
  },
});
